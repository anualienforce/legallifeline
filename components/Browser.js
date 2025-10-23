import React from 'react';
import { View } from 'react-native';
import WebView from 'react-native-webview';
import { DefaultTheme, ActivityIndicator } from 'react-native-paper';

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#323a43'
    }
  };

export default class Browser extends React.Component {

  constructor(props) {
      super(props);
  }

  render() {
     const { colors } = theme;
      return (<WebView source={{ uri: 'https://google.com/' }} 
                       style={{ marginTop: 30 }} 
                       startInLoadingState={true}
                       renderLoading={() => <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                              <ActivityIndicator animating={true} color={colors.primary} size='large' />
                                            </View>} />);
  }
}