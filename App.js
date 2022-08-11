/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {Text, View} from 'react-native';
import TopHat from './lib/TopHat';

const App = () => {
  return (
    <>
      <TopHat />
      <View style={{marginTop: 8}}>
        <Text>Hello world 123</Text>
      </View>
    </>
  );
};

export default App;
