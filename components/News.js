import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import {
  DefaultTheme,
  ActivityIndicator,
  Card,
  Button,
} from "react-native-paper";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Row, Column as Col } from "react-native-responsive-grid";
import WebView from "react-native-webview";

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#323a43",
  },
};

export default class News extends React.Component {
  constructor(props) {
    super(props);
    this.openNews = this.openNews.bind(this);
    this.closeNews = this.closeNews.bind(this);
    this.getNews = this.getNews.bind(this);
    this.state = {
      isLoading: true,
      userToken: null,
      authenticated: false,
      newsJson: null,
      isBrowserOpen: false,
      browserUrl: null,
    };
  }

  componentDidMount() {
    this.getNews();
  }

  getNews() {
    this.setState({
      isLoading: true,
      userToken: null,
      authenticated: false,
      newsJson: null,
      isBrowserOpen: false,
      browserUrl: null,
    });
    fetch("https://mobile-api.legallifelines.co.uk/api/v1/news/get-latest")
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          userToken: null,
          authenticated: false,
          newsJson: responseJson,
          isBrowserOpen: false,
          browserUrl: null,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isLoading: false }); // Ensure loading stops even if there is an error
      });
  }

  openNews(url) {
    this.setState({
      isBrowserOpen: true,
      browserUrl: url,
    });
  }

  closeNews() {
    // If you want to reload news when closing the browser:
    this.setState({ isBrowserOpen: false });
    // Or if you want to re-fetch: this.getNews();
  }

  render() {
    const { colors } = theme;

    // 1. SHOW LOADING INDICATOR
    if (this.state.isLoading) {
      return (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator
            animating={true}
            color={colors.primary}
            size="large"
          />
          <Text style={{ marginTop: 10, color: colors.primary }}>
            Loading News...
          </Text>
        </View>
      );
    }

    // 2. SHOW BROWSER (If a news item was clicked)
    if (this.state.isBrowserOpen) {
      return (
        <View style={{ flex: 1 }}>
          <Card
            style={{
              width: "100%",
              backgroundColor: "#323a43",
              paddingTop: 50,
              paddingBottom: 15,
              position: "absolute",
              top: 0,
              zIndex: 1,
              borderRadius: 0,
            }}
          >
            <Row>
              <Col
                size={25}
                style={{ borderTopLeftRadius: 5, borderBottomLeftRadius: 0 }}
              >
                <TouchableOpacity
                  onPress={() => {
                    this.closeNews();
                  }}
                  activeOpacity={1}
                >
                  <MaterialCommunityIcons
                    name="arrow-left"
                    color="#cdba6d"
                    size={33}
                    style={{
                      textAlign: "center",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 25,
                      marginLeft: 25,
                      width: "50%",
                    }}
                  />
                </TouchableOpacity>
              </Col>
              <Col
                size={75}
                style={{
                  backgroundColor: "#323a43",
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 0,
                }}
              >
                <Image
                  style={{ width: "77%", height: 95, marginLeft: 25 }}
                  source={require("../assets/logo.png")}
                />
              </Col>
            </Row>
          </Card>

          <WebView
            source={{ uri: this.state.browserUrl }}
            style={{ marginTop: 0 }}
            startInLoadingState={true}
            renderLoading={() => (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator
                  animating={true}
                  color={colors.primary}
                  size="large"
                />
              </View>
            )}
          />
        </View>
      );
    }

    // 3. SHOW NEWS LIST (Default View)
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <Row>
          <Col size={20}>
            <TouchableOpacity
              onPress={() => {
                // Assuming you want to close the news screen here. 
                // If this is a screen in a stack, use navigation.goBack()
                // For now, I kept your original logic but ensure isNewsOpen exists if used
                if (this.props.onClose) this.props.onClose(); 
              }}
              activeOpacity={1}
            >
              <MaterialCommunityIcons
                name="arrow-left"
                color="#cdba6d"
                size={33}
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  marginLeft: 25,
                  width: "50%",
                }}
              />
            </TouchableOpacity>
          </Col>
          <Col size={80}>
            <Text
              style={{
                fontSize: 25,
                padding: 10,
                fontWeight: "bold",
                color: "#cdba6d",
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              News
            </Text>
          </Col>
        </Row>
        <ScrollView>
          {this.state.newsJson !== null &&
            this.state.newsJson.map((news) => {
              return (
                <View key={news.id}>
                  <TouchableOpacity
                    onPress={() => {
                      this.openNews(news.link);
                    }}
                    activeOpacity={1}
                  >
                    <Card
                      style={{
                        width: "95%",
                        marginBottom: 5,
                        marginLeft: "2.5%",
                        backgroundColor: "#323a43",
                      }}
                    >
                      <Row>
                        <Col size={35} style={{ borderTopLeftRadius: 5 }}>
                          <Image
                            source={{ uri: news.image }}
                            style={{ width: 125, height: 125 }}
                          />
                        </Col>
                        <Col
                          size={65}
                          style={{
                            backgroundColor: "#323a43",
                            borderTopRightRadius: 5,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 20,
                              color: "#cdba6d",
                              paddingLeft: 10,
                              paddingTop: 10,
                            }}
                          >
                            {news.title}
                          </Text>
                          <Text
                            style={{
                              color: "#ffffff",
                              fontSize: 11,
                              paddingLeft: 10,
                            }}
                          >
                            {news.publishedDate}
                          </Text>
                        </Col>
                      </Row>
                      <Text style={{ padding: 10, color: "#ffffff" }}>
                        {news.summary}
                      </Text>
                    </Card>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
      </View>
    );
  }
}