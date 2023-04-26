import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { AuthProvider } from './hooks/useAuth';
import StackNavigator from './navigators/StackNavigator';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted from react-native core and will be removed in a future release.']);

export default function App() {
  return (
    <NavigationContainer>
      {/* HOC - Higher Order Component */}
      <AuthProvider>
        {/* Passes down auth to children */}
        <StackNavigator/>
      </AuthProvider>
    </NavigationContainer>
  );
}