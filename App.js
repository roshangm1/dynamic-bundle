/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Text, View } from 'react-native';
import TopHat from './lib/TopHat';

const App = () => {
  return (
    <>
      <TopHat />
      <View style={{marginTop: 8}}>
        <Text>Hello world</Text>
      </View>
    </>
  );
};

export default App;
