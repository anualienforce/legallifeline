import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DefaultTheme, Button, Card, ActivityIndicator, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

const theme = {
  ...DefaultTheme,
  roundness: 2 ,
  colors: {
    ...DefaultTheme.colors,
    primary: '#323a43',
  },
};

export default function SOS() {
  const cameraRef = useRef(null);
  const isRecordingRef = useRef(false);

  const [permission, requestPermission] = useCameraPermissions();
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPreview, setCameraPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // This new state will temporarily disable the record/stop button to prevent race conditions.
  const [isButtonLocked, setIsButtonLocked] = useState(false);

  const [localUserInformation, setLocalUserInformation] = useState(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    county: '',
    postcode: '',
  });

  useEffect(() => {
    (async () => {
      await requestPermission();
      const libPerm = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(libPerm.status === 'granted');
      await loadLocalUserInformation();
      setIsLoading(false);
    })();
  }, []);

  const loadLocalUserInformation = async () => {
    try {
      const data = await AsyncStorage.getItem('localUserInformation');
      if (data) setLocalUserInformation(JSON.parse(data));
    } catch (error) {
      console.error("Failed to load user information.", error);
    }
  };

  const saveUserInformation = async () => {
    const { firstName, lastName, phoneNumber, county, postcode } = form;
    if (!firstName || !lastName || !phoneNumber || !county || !postcode) {
      Alert.alert('Alert', 'Please fill in all required fields.');
      return;
    }
    const userInfo = { firstName, lastName, phoneNumber, county, postcode };
    try {
      await AsyncStorage.setItem('localUserInformation', JSON.stringify(userInfo));
      setLocalUserInformation(userInfo);
    } catch (error) {
      console.error("Failed to save user information.", error);
      Alert.alert('Error', 'Could not save user information.');
    }
  };

  const dialSolicitor = (number) => {
    const phoneNumber = Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`;
    Linking.openURL(phoneNumber).catch(err => console.error('Failed to open URL:', err));
  };

  const startRecording = async () => {
    if (isRecordingRef.current) return;
    if (!cameraRef.current || !isCameraReady) {
      Alert.alert('Camera not ready', 'Please wait for the camera to initialize.');
      return;
    }

    try {
      // Lock the button immediately when the function starts.
      setIsButtonLocked(true);
      isRecordingRef.current = true;
      setIsRecording(true);

      // Re-enable the button after 1 second. This grace period is crucial to avoid bounce taps.
      const unlockTimeout = setTimeout(() => setIsButtonLocked(false), 1000);

      const video = await cameraRef.current.recordAsync({ quality: '480p', maxDuration: 120 });
      
      // Clear the timeout in case stopRecording was called before 1 second passed.
      clearTimeout(unlockTimeout);

      setIsProcessing(true);
      setCameraPreview(false);

      if (hasMediaPermission) {
        await MediaLibrary.saveToLibraryAsync(video.uri);
      }
      
      const formData = new FormData();
      const user = localUserInformation;
      const fileName = `sos-${user.firstName}-${user.lastName}-${user.phoneNumber}-${user.county}-${user.postcode}.mp4`;

      formData.append('videoFile', {
        uri: video.uri,
        name: fileName,
        type: 'video/mp4',
      });

      await fetch('https://mobile-api.legallifelines.co.uk/api/v1/stopandsearch/upload-stop-and-search', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });

      Alert.alert('Success', 'Uploaded and saved successfully.');

    } catch (error) {
      console.error('Recording error:', error);
      // Only show an alert for unexpected errors.
      if (!error.message.includes("Recording was stopped")) {
        Alert.alert('Error', 'An error occurred during recording.');
      }
    } finally {
      // Always ensure everything is reset to a clean state.
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsProcessing(false);
      setIsButtonLocked(false);
    }
  };

  const stopRecording = () => {
    // Lock the button when stopping to prevent other unwanted interactions.
    setIsButtonLocked(true);
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const stopAndSearch = () => {
    setIsCameraReady(false);
    setCameraPreview(true);
  };
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <Text style={{textAlign: 'center', marginBottom: 10}}>Camera permission is required to record video.</Text>
        <Button onPress={requestPermission}>Grant Permission</Button>
      </View>
    );
  }

  if (!localUserInformation) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={{ textAlign: 'center', fontSize: 25, padding: 10, fontWeight: 'bold', color: '#cdba6d' }}>
                User Information
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 11, padding: 5, color: '#323a43', marginBottom: 15 }}>
                This information will be stored with any stop and search video uploaded.
              </Text>

              <Card style={{ width: '100%', backgroundColor: '#323a43', padding: 15 }}>
                {['firstName', 'lastName', 'phoneNumber', 'county', 'postcode'].map((key) => (
                  <TextInput
                    key={key}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                    theme={{ colors: { primary: '#cdba6d' } }}
                    onChangeText={(text) => setForm({ ...form, [key]: text })}
                    style={{ marginBottom: 10, height: 50 }}
                  />
                ))}
                <TouchableOpacity onPress={saveUserInformation} activeOpacity={0.8}>
                  <MaterialCommunityIcons name="login" color="#cdba6d" size={33} style={{ textAlign: 'center', marginTop: 10 }} />
                </TouchableOpacity>
              </Card>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (isProcessing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#323a43' }}>
        <ActivityIndicator animating size="large" color="#cdba6d" />
        <Text style={{ color: '#cdba6d', fontSize: 22, marginTop: 20 }}>Uploading, please wait...</Text>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10, paddingHorizontal: 20 }}>
          Please wait while we encrypt and upload your video securely.
        </Text>
      </View>
    );
  }

  if (cameraPreview) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView
          ref={cameraRef}
		   mode="video"
          facing="back"
          style={{ flex: 1 }}
          onCameraReady={() => setIsCameraReady(true)}
        />
        <TouchableOpacity
          // The button is now disabled based on the isButtonLocked state.
          disabled={isButtonLocked}
          onPress={isRecording ? stopRecording : startRecording}
          style={{ 
            backgroundColor: '#323a43', 
            width: '100%',
            // This provides visual feedback to the user when the button is locked.
            opacity: isButtonLocked ? 0.5 : 1.0 
          }}
        >
          <Text style={{ fontSize: 17, color: '#cdba6d', padding: 20, textAlign: 'center', fontWeight: 'bold' }}>
            {isRecording ? 'STOP' : 'RECORD'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 25 }}>
      <Card style={{ width: '100%', backgroundColor: '#323a43', padding: 15 }}>
        <Button
          icon={() => <MaterialCommunityIcons name="camera" color="white" size={44} />}
          mode="contained"
          onPress={stopAndSearch}
          style={{ backgroundColor: '#c4302b', paddingTop: 30, paddingBottom: 30 }}
        >
          Record Stop & Search
        </Button>
        <Text style={{ textAlign: 'center', color: '#ffffff', paddingTop: 15, fontSize: 12 }}>
          Live record your <Text style={{ fontWeight: 'bold', color: '#cdba6d' }}>stop and search</Text>. Video and audio
          recordings can be used as <Text style={{ fontWeight: 'bold', color: '#cdba6d' }}>evidence</Text> if necessary.
        </Text>
      </Card>
      <View style={{ borderBottomColor: '#cdba6d', borderBottomWidth: 5, marginVertical: 20 }} />
      <Card style={{ width: '100%', backgroundColor: '#323a43', padding: 15 }}>
        <Button
          mode="contained"
          icon={() => <MaterialCommunityIcons name="phone" color="white" size={44} />}
          onPress={() => dialSolicitor('02071128711')}
          style={{ backgroundColor: '#c4302b', paddingTop: 30, paddingBottom: 30 }}
        >
          Call Solicitor
        </Button>
        <Text style={{ textAlign: 'center', color: '#ffffff', paddingTop: 15, fontSize: 12 }}>
          If you are in <Text style={{ fontWeight: 'bold', color: '#cdba6d' }}>custody</Text> or being{' '}
          <Text style={{ fontWeight: 'bold', color: '#cdba6d' }}>arrested</Text>, call immediately for specialist advice.
        </Text>
      </Card>
    </SafeAreaView>
  );
}