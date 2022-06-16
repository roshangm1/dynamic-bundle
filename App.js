/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Image, View} from 'react-native';
import TopHat from './lib/TopHat';

const App = () => {
  return (
    <>
      <TopHat />
      <View style={{marginTop: 8}}>
        <Image
          source={require('./assets/images/listinfo.png')}
          style={{height: 200, width: 200}}
        />
      </View>
    </>
  );
};

export default App;
