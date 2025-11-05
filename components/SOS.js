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
  Dimensions,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DefaultTheme,
  Button,
  Card,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';

const { width, height } = Dimensions.get('window');

// --- THEME CONFIGURATION ---
const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: '#323a43',
    secondary: '#cdba6d',
    error: '#c4302b',
    background: '#f5f5f5',
  },
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width > 768 ? '20%' : 20,
    paddingVertical: 30,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: width > 768 ? '15%' : 20,
    paddingVertical: 20,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraView: {
    flex: 1,
  },
  cameraControlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingBottom: 40,
    paddingTop: 20,
  },
  recordButton: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  recordButtonRecording: {
    backgroundColor: '#fff',
  },
  recordButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordButtonStop: {
    width: 30,
    height: 30,
    backgroundColor: theme.colors.error,
    borderRadius: 4,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.error,
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1,
  },
  cameraInfoText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: width > 768 ? 32 : 26,
    fontWeight: 'bold',
    color: theme.colors.secondary,
    marginBottom: 10,
  },
  subHeaderText: {
    textAlign: 'center',
    fontSize: width > 768 ? 14 : 12,
    color: theme.colors.primary,
    marginBottom: 30,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  permissionText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
    color: theme.colors.primary,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  actionDescription: {
    textAlign: 'center',
    color: '#ffffff',
    paddingTop: 16,
    fontSize: width > 768 ? 14 : 12,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: theme.colors.secondary,
  },
  card: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    padding: width > 768 ? 30 : 20,
    borderRadius: 12,
    elevation: 4,
  },
  actionCard: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    padding: width > 768 ? 25 : 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  submitButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  actionButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: width > 768 ? 20 : 15,
    borderRadius: 8,
  },
  actionButtonLabel: {
    fontSize: width > 768 ? 18 : 16,
    fontWeight: '600',
  },
  divider: {
    borderBottomColor: theme.colors.secondary,
    borderBottomWidth: 3,
    marginVertical: 25,
    width: '100%',
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
    maxWidth: 350,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  overlaySubText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    color: '#666',
    lineHeight: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(50,58,67,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});

export default function SOS() {
  const cameraRef = useRef(null);
  const isRecordingRef = useRef(false);
  const recordingStartTimeRef = useRef(null);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, requestMicrophonePermission] = useMicrophonePermissions();
  const [hasMediaPermission, setHasMediaPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [localUserInformation, setLocalUserInformation] = useState(null);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    county: '',
    postcode: '',
  });

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await requestCameraPermission();
      await requestMicrophonePermission();
      const libPerm = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(libPerm.status === 'granted');
      await loadLocalUserInformation();
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLocalUserInformation = async () => {
    try {
      const data = await AsyncStorage.getItem('localUserInformation');
      if (data) {
        setLocalUserInformation(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to load user information:', error);
    }
  };

  const saveUserInformation = async () => {
    const { firstName, lastName, phoneNumber, county, postcode } = form;
    if (!firstName || !lastName || !phoneNumber || !county || !postcode) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }

    const userInfo = { firstName, lastName, phoneNumber, county, postcode };
    try {
      await AsyncStorage.setItem('localUserInformation', JSON.stringify(userInfo));
      setLocalUserInformation(userInfo);
      Alert.alert('Success', 'Your information has been saved successfully.');
    } catch (error) {
      console.error('Failed to save user information:', error);
      Alert.alert('Error', 'Could not save your information. Please try again.');
    }
  };

  const dialSolicitor = (number) => {
    const phoneNumber = Platform.OS === 'android' ? `tel:${number}` : `telprompt:${number}`;
    Linking.openURL(phoneNumber).catch(() => 
      Alert.alert('Error', 'Unable to open phone dialer.')
    );
  };

  const uploadToServer = async (uri, fileName) => {
    try {
		const formData = new FormData();
		formData.append('videoFile', { uri, name: fileName, type: 'video/mp4' });


		const response = await fetch('https://mobile-api.legallifelines.co.uk/api/v1/stopandsearch/upload-stop-and-search',
			{
				method:'POST',
				body:formData
			}
		)

		const text = await response.text();
		console.log('Raw response:', text);
		let json;
		json = JSON.parse(text)

		console.log('Server response:', json);
		console.log('Status:', response.status);


		if(response.ok){
			console.log('Upload successful ✅');
      return true;
		}else{
			console.error('Upload failed ❌', response.status, json);
      return false;
		}
	} catch (error) {
		console.error('Upload error:', error);
    return false;
	}
  };

  const startRecording = async () => {
    if (isRecordingRef.current || !cameraRef.current || !isCameraReady) {
      if (!isCameraReady) {
        Alert.alert('Camera Not Ready', 'Please wait for the camera to initialize.');
      }
      return;
    }

    try {
      isRecordingRef.current = true;
      setIsRecording(true);
      recordingStartTimeRef.current = Date.now();

      const video = await cameraRef.current.recordAsync({
        quality: '480p',
        maxDuration: 120,
      });

      // Recording stopped - handle the video
      await handleRecordingComplete(video);

    } catch (error) {
      console.error('Recording error:', error);
      if (!error.message?.includes('stopped')) {
        Alert.alert('Recording Error', 'Failed to record. Please try again.');
      }
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!cameraRef.current || !isRecordingRef.current) return;

    try {
      cameraRef.current.stopRecording();
    } catch (error) {
      console.error('Stop recording error:', error);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const handleRecordingComplete = async (video) => {
    // Reset recording state
    isRecordingRef.current = false;
    setIsRecording(false);

    // Close camera and show processing overlay
    setShowCamera(false);
    setIsCameraReady(false);
    setIsProcessing(true);

    let uploadSuccess = false;

    try {
      // Save to gallery
      if (hasMediaPermission && video?.uri) {
        await MediaLibrary.saveToLibraryAsync(video.uri);
        console.log('Video saved to gallery');
      }

      // Upload to Firebase
      const user = localUserInformation;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `sos-${user.firstName}-${user.lastName}-${user.phoneNumber}-${user.county}-${user.postcode}-${timestamp}.mp4`;

      uploadSuccess = await uploadToServer(video.uri, fileName);
    } catch (error) {
      console.error('Post-recording processing error:', error);
      uploadSuccess = false;
    } finally {
      setIsProcessing(false);

      if (uploadSuccess) {
        Alert.alert(
          'Upload Successful',
          'Your video has been securely uploaded and saved.',
          [{ text: 'OK', style: 'default' }]
        );
      } else {
        Alert.alert(
          'Upload Failed',
          'Failed to upload your video. It has been saved to your gallery.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  };

  const openCamera = () => {
    setShowCamera(true);
    setIsCameraReady(false);
  };

  const closeCamera = () => {
    if (isRecording) {
      Alert.alert(
        'Recording in Progress',
        'Please stop the recording before closing the camera.',
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }
    setShowCamera(false);
    setIsCameraReady(false);
  };

  // --- RENDER FUNCTIONS ---

  const renderLoadingScreen = () => (
    <View style={styles.centerContent}>
      <ActivityIndicator animating size="large" color={theme.colors.primary} />
      <Text style={{ marginTop: 20, color: theme.colors.primary }}>Loading...</Text>
    </View>
  );

  const renderPermissionsScreen = () => (
    <View style={styles.centerContent}>
      <MaterialCommunityIcons
        name={!cameraPermission?.granted ? 'camera-off' : 'microphone-off'}
        size={64}
        color={theme.colors.primary}
      />
      <Text style={styles.permissionText}>
        {!cameraPermission?.granted && !microphonePermission?.granted
          ? 'Camera and microphone permissions are required to record video with audio.'
          : !cameraPermission?.granted
          ? 'Camera permission is required to record video.'
          : 'Microphone permission is required to record audio.'}
      </Text>
      <Button
        mode="contained"
        onPress={async () => {
          if (!cameraPermission?.granted) await requestCameraPermission();
          if (!microphonePermission?.granted) await requestMicrophonePermission();
        }}
        style={{ backgroundColor: theme.colors.error }}
      >
        Grant Permissions
      </Button>
    </View>
  );

  const renderUserInfoForm = () => (
    <SafeAreaView style={styles.formContainer} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.headerText}>User Information</Text>
            <Text style={styles.subHeaderText}>
              This information will be securely stored with any stop and search video you upload.
            </Text>
            <Card style={styles.card}>
              <TextInput
                label="First Name"
                value={form.firstName}
                onChangeText={(text) => setForm({ ...form, firstName: text })}
                style={styles.input}
              />
              <TextInput
                label="Last Name"
                value={form.lastName}
                onChangeText={(text) => setForm({ ...form, lastName: text })}
                style={styles.input}
              />
              <TextInput
                label="Phone Number"
                value={form.phoneNumber}
                onChangeText={(text) => setForm({ ...form, phoneNumber: text })}
                style={styles.input}
                keyboardType="phone-pad"
              />
              <TextInput
                label="County"
                value={form.county}
                onChangeText={(text) => setForm({ ...form, county: text })}
                style={styles.input}
              />
              <TextInput
                label="Postcode"
                value={form.postcode}
                onChangeText={(text) => setForm({ ...form, postcode: text })}
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={saveUserInformation}
                style={styles.submitButton}
                color={theme.colors.secondary}
              >
                Save Information
              </Button>
            </Card>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  const renderCameraView = () => (
    <View style={styles.cameraContainer}>
      <StatusBar hidden />
      <CameraView
        ref={cameraRef}
        mode="video"
        facing="back"
        style={styles.cameraView}
        onCameraReady={() => setIsCameraReady(true)}
      />

      <TouchableOpacity style={styles.closeButton} onPress={closeCamera}>
        <MaterialCommunityIcons name="close" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.cameraControlsContainer}>
        {isRecording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>RECORDING</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.recordButton, isRecording && styles.recordButtonRecording]}
          onPress={isRecording ? stopRecording : startRecording}
          disabled={!isCameraReady}
          activeOpacity={0.8}
        >
          <View style={styles.recordButtonInner}>
            {isRecording && <View style={styles.recordButtonStop} />}
          </View>
        </TouchableOpacity>

        <Text style={styles.cameraInfoText}>
          {!isCameraReady
            ? 'Initializing camera...'
            : isRecording
            ? 'Tap to stop recording'
            : 'Tap to start recording'}
        </Text>
      </View>
    </View>
  );

  const renderMainMenu = () => (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.actionCard}>
          <Button
            icon={() => (
              <MaterialCommunityIcons
                name="video"
                color="white"
                size={width > 768 ? 52 : 44}
              />
            )}
            mode="contained"
            onPress={openCamera}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
          >
            Record Stop & Search
          </Button>
          <Text style={styles.actionDescription}>
            Live record your <Text style={styles.boldText}>stop and search</Text>. Video and
            audio recordings can be used as <Text style={styles.boldText}>evidence</Text>.
          </Text>
        </Card>

        <View style={styles.divider} />

        <Card style={styles.actionCard}>
          <Button
            mode="contained"
            icon={() => (
              <MaterialCommunityIcons
                name="phone"
                color="white"
                size={width > 768 ? 52 : 44}
              />
            )}
            onPress={() => dialSolicitor('02071128711')}
            style={styles.actionButton}
            labelStyle={styles.actionButtonLabel}
          >
            Call Solicitor
          </Button>
          <Text style={styles.actionDescription}>
            If you are in <Text style={styles.boldText}>custody</Text> or being{' '}
            <Text style={styles.boldText}>arrested</Text>, call immediately for specialist
            advice.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );

  const renderProcessingOverlay = () => (
    <View style={styles.fullScreenOverlay}>
      <View style={styles.overlayContent}>
        <ActivityIndicator animating size="large" color={theme.colors.primary} />
        <Text style={styles.overlayTitle}>Uploading Securely...</Text>
        <Text style={styles.overlaySubText}>
          Please keep the app open. This may take a moment.
        </Text>
      </View>
    </View>
  );

  // --- MAIN RENDER ---

  return (
    <View style={styles.rootContainer}>
      {isLoading && renderLoadingScreen()}
      
      {!isLoading && (!cameraPermission?.granted || !microphonePermission?.granted) &&
        renderPermissionsScreen()}
      
      {!isLoading && cameraPermission?.granted && microphonePermission?.granted &&
        !localUserInformation && renderUserInfoForm()}
      
      {!isLoading && cameraPermission?.granted && microphonePermission?.granted &&
        localUserInformation && !showCamera && renderMainMenu()}
      
      {!isLoading && cameraPermission?.granted && microphonePermission?.granted &&
        localUserInformation && showCamera && renderCameraView()}
      
      {isProcessing && renderProcessingOverlay()}
    </View>
  );
}