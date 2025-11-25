import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { DefaultTheme, ActivityIndicator } from "react-native-paper";
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
  // We don't need complex state anymore since we are just showing one URL
  constructor(props) {
    super(props);
    this.state = {
      visible: true // Used to show/hide the spinner
    };
  }

  hideSpinner() {
    this.setState({ visible: false });
  }

  showSpinner() {
    this.setState({ visible: true });
  }

  render() {
    const { colors } = theme;

    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        {/* --- HEADER START --- */}
        <Row>
          <Col size={20}>
            <TouchableOpacity
              onPress={() => {
                // If this component is inside a parent that handles navigation:
                if (this.props.onClose) {
                    this.props.onClose();
                } else {
                    // Fallback or your original logic (though isNewsOpen wasn't in state)
                    console.log("Back pressed");
                }
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
        {/* --- HEADER END --- */}

        {/* --- WEBVIEW WITH LOADING --- */}
        <View style={{ flex: 1 }}>
          <WebView
            source={{ uri: "https://www.theguardian.com/uk/ukcrime" }}
            onLoadStart={() => this.showSpinner()}
            onLoadEnd={() => this.hideSpinner()}
            style={{ flex: 1 }}
          />

          {/* Loading Overlay */}
          {this.state.visible && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white", // Optional: hide white screen while loading
              }}
            >
              <ActivityIndicator
                animating={true}
                color={colors.primary}
                size="large"
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}