/**
 * @format
 */

import 'react-native-reanimated';

import { AppRegistry, DevSettings,NativeModules } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

const {RNRestart, RNDynamicBundle} = NativeModules;



DevSettings.addMenuItem('Toggle Dev Mode', () => {

    RNDynamicBundle.getDevMode().then(value => {
        if (value === 'true') {
            RNDynamicBundle.disableDevMode();
          } else {
            RNDynamicBundle.enableDevMode();
          }

          RNRestart.Restart();
        });

});

AppRegistry.registerComponent(appName, () => App);
