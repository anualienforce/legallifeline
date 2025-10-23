import React from 'react';
import { View, Image, ScrollView, TouchableOpacity, Text, Linking } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Row, Column as Col } from 'react-native-responsive-grid'

export default class YourRights extends React.Component {

  constructor(props) {
      super(props);
      this.state = {isYouRightsOpen: false};
  }

  render() {
    if (this.state.isYouRightsOpen) {
        return (<View style={{flex: 1, marginTop: 30}}>
              <Row>
              <Col size={20}>
                <TouchableOpacity onPress={() => { this.setState({ isYouRightsOpen: false }) }} activeOpacity={1}>
                    <MaterialCommunityIcons name="arrow-left" color='#cdba6d' size={33} style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 10, marginLeft: 25, width: "50%" }} />
                </TouchableOpacity>
              </Col>
              <Col size={80}>
               <Text style={{ fontSize: 25, padding: 10, fontWeight: 'bold', color: '#cdba6d', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}>Your Rights</Text>
              </Col>
              </Row>
              <ScrollView>
                <Image
                    style={{ width: "100%", resizeMode: "contain", height: 1200 }}
                    source={require('../assets/your-rights.png')}
                  />
              </ScrollView>
          </View>);
    }

    return (<View style={{flex: 1, marginTop: 50, marginBottom: 25, paddingLeft: 25, paddingRight: 25 }}>
      <Card style={{ width: "100%", backgroundColor: '#323a43', paddingLeft: 15, paddingRight: 15, flex: 1, paddingTop: 15 }}>
        <Button icon={() => <MaterialCommunityIcons name="email-newsletter" color='white' size={44} style={{ textAlign: 'center' }} />} mode="contained" onPress={() => this.setState({ isYouRightsOpen: true }) } style={{ backgroundColor: '#c4302b', alignItems: "center", justifyContent: "center", flex: 1, marginBottom: 15 }}>Your Rights</Button>
      </Card>
      <View style={{ borderBottomColor: '#cdba6d', borderBottomWidth: 5 }} />
      <Card style={{ width: "100%", backgroundColor: '#323a43', paddingLeft: 15, paddingRight: 15, flex: 1, paddingTop: 15 }}>
        <Button mode="contained" icon={() => <MaterialCommunityIcons name="video" color='white' size={44} style={{ textAlign: 'center' }} />} onPress={() => Linking.openURL("https://youtu.be/dli491WkkdE") } style={{ backgroundColor: '#c4302b', alignItems: "center", justifyContent: "center", flex: 1, marginBottom: 15 }}>Stop & Search Webinar</Button>
      </Card>
    </View>);

  }
}