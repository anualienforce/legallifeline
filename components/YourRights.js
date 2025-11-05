import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, Text, Linking, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Row, Column as Col } from 'react-native-responsive-grid';

export default class YourRights extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isYouRightsOpen: false };
  }

  render() {
    if (this.state.isYouRightsOpen) {
      return (
        <View style={styles.container}>
          <Row>
            <Col size={20}>
              <TouchableOpacity onPress={() => this.setState({ isYouRightsOpen: false })} activeOpacity={0.8}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  color="#cdba6d"
                  size={30}
                  style={styles.backIcon}
                />
              </TouchableOpacity>
            </Col>
            <Col size={80}>
              <Text style={styles.title}>Your Rights</Text>
            </Col>
          </Row>

          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <Image
              style={styles.image}
              source={require('../assets/your-rights.png')}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.mainScreen}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Your Rights Card */}
          <Card style={styles.card}>
            <Button
              icon={() => (
                <MaterialCommunityIcons
                  name="email-newsletter"
                  color="white"
                  size={40}
                />
              )}
              mode="contained"
			  contentStyle={{ height: '100%' }}
              onPress={() => this.setState({ isYouRightsOpen: true })}
              style={styles.redButton}
              labelStyle={styles.buttonLabel}
            >
              Your Rights
            </Button>
          </Card>

          <View style={styles.separator} />

          {/* Webinar Card */}
          <Card style={styles.card}>
            <Button
              icon={() => (
                <MaterialCommunityIcons name="video" color="white" size={40} />
              )}
              mode="contained"
			  contentStyle={{ height: '100%' }}
              onPress={() => Linking.openURL('https://youtu.be/dli491WkkdE')}
              style={styles.redButton}
              labelStyle={styles.buttonLabel}
            >
              Stop & Search Webinar
            </Button>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e242b',
    paddingTop: 40,
  },
  backIcon: {
    textAlign: 'center',
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cdba6d',
    textAlign: 'center',
    marginTop: 5,
  },
  image: {
    width: '100%',
    resizeMode: 'contain',
    height: 1200,
  },
  mainScreen: {
    flex: 1,
    backgroundColor: '#1e242b',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#323a43',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
	height: 320
  },
  redButton: {
    backgroundColor: '#c4302b',
    paddingVertical: 10,
    borderRadius: 8,
	width: '100%',
	height: '100%',
	justifyContent: 'center'
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  separator: {
    borderBottomColor: '#cdba6d',
    borderBottomWidth: 3,
    marginVertical: 10,
  },
});
