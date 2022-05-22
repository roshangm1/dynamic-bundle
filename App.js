/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {
  Alert,
  Button,
  NativeModules,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
} from 'react-native';
import {unzip} from 'react-native-zip-archive';

import DefaultPreference from 'react-native-default-preference';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'rn-fetch-blob';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';

const {RNRestart} = NativeModules;

const App = () => {
  const [branchName, setBranchName] = React.useState('');
  const [isOfflineBundle, setIsOfflineBundle] = React.useState(false);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const backgroundStyle = {
    flex: 1,
    backgroundColor: Colors.lighter,
    padding: 16,
  };

  useEffect(() => {
    DefaultPreference.get('isDevMode').then(value => {
      setIsOfflineBundle(value === 'true');
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
    })();
  }, []);

  const barcodeLength = barcodes.length;
  const displayValue = barcodes?.[0]?.displayValue;

  useEffect(() => {
    if (barcodeLength > 0) {
      setIsCameraOpen(false);
      downloadBundle(displayValue, true);
    }
  }, [barcodeLength, displayValue, downloadBundle]);

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

  const actualDownload = async (url, fromCamera) => {
    try {
      const response = await fetch(url);
      if (response.status !== 200) {
        Alert.alert('Error', 'Could not download the bundle');
        return;
      }
    } catch (error) {
      console.log(error);
    }

    const fileName = '/artifacts.zip';
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
        unzip(
          res.path(),
          Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir,
        ).then(path => {
          console.log(`unzip completed at ${path}`);
          if (!fromCamera) {
            RNRestart.Restart();
          } else {
            Alert.alert(
              'Success',
              'Bundle downloaded successfully. Please restart manually',
            );
          }
        });
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {});
  };

  const downloadBundle = React.useCallback(async (url, fromCamera) => {
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
        actualDownload(url, fromCamera);
      } else {
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const openCamera = () => {
    setIsCameraOpen(prevState => !prevState);
  };

  return (
    <>
      {isCameraOpen ? (
        device != null && (
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={isCameraOpen}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
          />
        )
      ) : (
        <SafeAreaView style={backgroundStyle}>
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
            <Header />
            <View style={{marginTop: 8}}>
              <Image
                source={require('./assets/images/listinfo.png')}
                style={{height: 200, width: 200}}
              />
            </View>
            {isOfflineBundle ? (
              <Button
                title="Download"
                onPress={() =>
                  downloadBundle(
                    `https://a609pi.deta.dev/download/${branchName}/artifacts.zip`,
                  )
                }
              />
            ) : null}
            <Button
              title={
                isOfflineBundle
                  ? 'Disable Offline Bundle'
                  : 'Enable Offline Bundle'
              }
              onPress={togleDevMode}
            />
            {isOfflineBundle ? (
              <Button title="Open Camera" onPress={openCamera} />
            ) : null}
            <Text>Hello world</Text>
            <Text>Hello world</Text>
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default App;
