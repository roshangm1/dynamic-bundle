/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Button,
  NativeModules,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'rn-fetch-blob';
import DefaultPreference from 'react-native-default-preference';

const {RNRestart} = NativeModules;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [branchName, setBranchName] = React.useState('');
  const [isOfflineBundle, setIsOfflineBundle] = React.useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    padding: 16,
  };

  useEffect(() => {
    DefaultPreference.get('isDevMode').then(value => {
      setIsOfflineBundle(value === 'true');
    });
  }, []);

  const togleDevMode = async () => {
    const isDevMode = await DefaultPreference.get('isDevMode');
    if (isDevMode === 'true') {
      DefaultPreference.set('isDevMode', 'false');
      setIsOfflineBundle(false);
    } else {
      DefaultPreference.set('isDevMode', 'true');
      setIsOfflineBundle(true);
    }
    RNRestart.Restart();
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
    if (branchName) {
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
          actualDownload(
            `https://roshan-upload-demo.herokuapp.com/${branchName}/main.js`,
          );
        } else {
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <TextInput
          style={{height: 45, borderWidth: 1, paddingHorizontal: 8}}
          value={branchName}
          autoCapitalize={'none'}
          onChangeText={value => {
            setBranchName(value);
          }}
        />
        <View style={{marginTop: 8}}>
          <Text>Hello Roshan</Text>
          <Text>Hello Roshan</Text>

          <Text>Happy New Year</Text>
          <Text style={{fontSize: 72}}> 2023</Text>
        </View>
        {isOfflineBundle ? (
          <Button title="Download" onPress={downloadPdf} />
        ) : null}
        <Button
          title={
            isOfflineBundle ? 'Disable Offline Bundle' : 'Enable Offline Bundle'
          }
          onPress={togleDevMode}
        />
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
