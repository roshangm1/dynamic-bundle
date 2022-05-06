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
} from 'react-native';
import DefaultPreference from 'react-native-default-preference';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RNFetchBlob from 'rn-fetch-blob';
import {BarcodeFormat, useScanBarcodes} from 'vision-camera-code-scanner';

const {RNRestart} = NativeModules;

const App = () => {
  const [branchName, setBranchName] = React.useState('');
  const [buildUrl, setBuildUrl] = React.useState('');
  const [isOfflineBundle, setIsOfflineBundle] = React.useState(false);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const devices = useCameraDevices();
  const device = devices.back;

  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  console.log(barcodes);
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

  useEffect(() => {
    setBuildUrl(
      `https://roshan-upload-demo.herokuapp.com/${branchName}/main.js`,
    );
  }, [branchName]);

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
    })();
  }, []);

  const barcodeLength = barcodes.length;
  const displayValue = barcodes?.[0]?.displayValue;

  useEffect(() => {
    if (barcodeLength) {
      setIsCameraOpen(false);
    }
    downloadPdf(displayValue);
  }, [barcodeLength, displayValue, downloadPdf]);

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

  const actualDownload = async url => {
    const response = await fetch(url);
    if (response.status !== 200) {
      Alert.alert('Error', 'Could not download the bundle');
      return;
    }

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

  const downloadPdf = React.useCallback(
    async url => {
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
            actualDownload(url);
          } else {
          }
        } catch (err) {
          console.log(err);
        }
      }
    },
    [branchName],
  );

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
            <View style={{marginTop: 8}}>
              <Text>Testing new stuff</Text>
              <Text>Testing new stuff</Text>
            </View>
            {isOfflineBundle ? (
              <Button title="Download" onPress={() => downloadPdf(buildUrl)} />
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
          </ScrollView>
        </SafeAreaView>
      )}
    </>
  );
};

export default App;
