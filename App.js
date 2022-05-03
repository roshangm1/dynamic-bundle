/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NativeModules} from 'react-native';

const {RNRestart} = NativeModules;

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'rn-fetch-blob';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const actualDownload = url => {
    const fileName = '/main.js';
    const brokenUrl = url?.split('.');
    const extension = brokenUrl?.[brokenUrl.length - 1];
    const dirs = RNFetchBlob.fs.dirs;
    const newFilePath = dirs.DownloadDir + fileName;
    const newiOSPath = dirs.DocumentDir + fileName;
    RNFetchBlob.config({
      fileCache: true,
      appendExt: extension,
      path: Platform.OS === 'ios' ? newiOSPath : newFilePath,
    })
      .fetch('GET', encodeURI(url), {})
      .then(res => {
        console.log(res);
        RNRestart.Restart();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {});
  };

  const downloadPdf = async () => {
    try {
      const granted =
        Platform.OS === 'android'
          ? await PermissionsAndroid.request(
              'android.permission.WRITE_EXTERNAL_STORAGE',
            )
          : 'granted';

      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === 'ios'
      ) {
        actualDownload('https://roshan-upload-demo.herokuapp.com/main.js');
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={{padding: 16}}>
          <Text>I am Roshan Gautam</Text>
        </View>
        <Button title="Download" onPress={downloadPdf} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
