import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
  ScrollView,
} from "react-native";
import { DefaultTheme, ActivityIndicator, Card } from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Row, Column as Col } from "react-native-responsive-grid";
import * as Linking from "expo-linking";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#323a43",
  },
};

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
  }

  componentDidMount() {
    let self = this;
    setTimeout(function () {
      self.setState({ isLoading: false });
    }, 2000);
  }

  render() {
    const onShare = async () => {
      try {
        const result = await Share.share({
          message:
            "Legal Lifelines App - Elite legal advice at the touch of a button http://onelink.to/7wcjp7",
          url: "http://onelink.to/7wcjp7",
        });
      } catch (error) {}
    };

    if (this.state.isLoading) {
      const { colors } = theme;
      return (
        <View style={styles.container}>
          <Row>
            <Col size={100}>
              <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}
              />
            </Col>
          </Row>
          <View
            style={{
              borderBottomColor: "#cdba6d",
              borderBottomWidth: 3,
              width: "100%",
              paddingTop: 35,
            }}
          />

          <Text
            style={{
              paddingTop: 25,
              paddingBottom: 5,
              fontSize: 15,
              fontWeight: "bold",
              color: "#323a43",
              textAlign: "center",
            }}
          >
            Empowering the community together.
          </Text>

          <Text
            style={{
              paddingBottom: 25,
              fontSize: 15,
              fontWeight: "bold",
              color: "#323a43",
              textAlign: "center",
            }}
          >
            {" "}
            #unity #community #justice{" "}
          </Text>

          <ActivityIndicator
            animating={true}
            color={colors.primary}
            size="large"
            style={{ paddingTop: 35 }}
          />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <Row>
            <Col size={90}></Col>
            <Col size={10}>
              <TouchableOpacity
                onPress={onShare}
                activeOpacity={1}
                style={{ paddingTop: 20 }}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  color="#cdba6d"
                  size={33}
                  style={{ textAlign: "right" }}
                />
              </TouchableOpacity>
            </Col>
          </Row>
          <Row>
            <Col size={100}>
              <Image
                style={styles.logoImage}
                source={require("../assets/logo.png")}
              />
            </Col>
          </Row>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#323a43" }}>
            Welcome to <Text style={{ color: "#cdba6d" }}>Legal Lifelines</Text>{" "}
            App
          </Text>

          <View
            style={{
              borderBottomColor: "#cdba6d",
              borderBottomWidth: 3,
              width: "100%",
            }}
          />

          <Card
            style={{
              width: "100%",
              marginBottom: 5,
              marginTop: 15,
              padding: 10,
              backgroundColor: "#323a43",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                paddingTop: 15,
                fontSize: 15,
                fontWeight: "bold",
                color: "#ffffff",
                textAlign: "center",
              }}
            >
              Legal Lifelines is a pioneering law practice that proudly serves
              the community. We are committed to overcome injustice and
              prejudice by championing equality for all.
            </Text>

            <Text
              style={{ color: "#ffffff", paddingTop: 15, textAlign: "center" }}
            >
              Gain instant stop and search protection via the Legal Lifelines
              Stop & Search App SOS feature. Arrested? Ask for Michael Herford
              and his team will immediately mobilise anywhere within England &
              Wales.
            </Text>

            <Text
              style={{ color: "#ffffff", paddingTop: 15, textAlign: "center" }}
            >
              If you have been charged with an offence and need advice, please
              call us on 02071 128711 to speak with a member of the team.
            </Text>

            <Text
              style={{ color: "#ffffff", paddingTop: 15, textAlign: "center" }}
            >
              We go above and beyond as standard.{"\n"}#Unity #Community
              #Justice
            </Text>

            <Text
              style={{
                color: "#cdba6d",
                paddingTop: 15,
                paddingBottom: 10,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Follow our social media!
            </Text>

            <Row>
              <Col size={25}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://twitter.com/LegalLifelines");
                  }}
                  activeOpacity={1}
                >
                  <MaterialCommunityIcons
                    name="twitter"
                    color="#cdba6d"
                    size={33}
                    style={{ textAlign: "center" }}
                  />
                </TouchableOpacity>
              </Col>
              <Col size={25}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://instagram.com/legal_lifelines_uk");
                  }}
                  activeOpacity={1}
                >
                  <MaterialCommunityIcons
                    name="instagram"
                    color="#cdba6d"
                    size={33}
                    style={{ textAlign: "center" }}
                  />
                </TouchableOpacity>
              </Col>
              <Col size={25}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      "https://linkedin.com/company/legallifelines"
                    );
                  }}
                  activeOpacity={1}
                >
                  <MaterialCommunityIcons
                    name="linkedin"
                    color="#cdba6d"
                    size={33}
                    style={{ textAlign: "center" }}
                  />
                </TouchableOpacity>
              </Col>
              <Col size={25}>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL("https://facebook.com/LegalLifelinesUK");
                  }}
                  activeOpacity={1}
                >
                  <MaterialCommunityIcons
                    name="facebook"
                    color="#cdba6d"
                    size={33}
                    style={{ textAlign: "center" }}
                  />
                </TouchableOpacity>
              </Col>
            </Row>
          </Card>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    flex: 1,
  },
  logoImage: {
    width: "100%",
    height: 121,
    marginTop: 45,
    marginBottom: 25,
    resizeMode: "contain",
  },
  utcaiImage: {
    width: "100%",
    height: 151,
    resizeMode: "contain",
    marginTop: 50,
    marginBottom: 50,
  },
  utcaiImageSecondary: {
    width: "100%",
    height: 101,
    resizeMode: "contain",
    marginTop: 50,
    marginBottom: 50,
  },
});
