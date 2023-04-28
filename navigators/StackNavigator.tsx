import React from 'react'
import { NativeStackNavigationOptions, createNativeStackNavigator } from '@react-navigation/native-stack'
import useAuth from '../hooks/useAuth';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import LoginScreen from '../screens/LoginScreen';
import ModalScreen from '../screens/ModalScreen';
import MatchScreen from '../screens/MatchScreen';
import MessageScreen from '../screens/MessageScreen';
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Initialise the Root Stack Navigator
const Stack = createNativeStackNavigator();
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Global Screen Options
const globalScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//   Create Stack Navigator Wrapper
const StackNavigator = () => {
    const { userName } = useAuth();
    return (
      <Stack.Navigator screenOptions={globalScreenOptions}>
          {userName ? (
              <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Message" component={MessageScreen} />
              <Stack.Screen name="Modal" component={ModalScreen} options={{presentation: 'modal' }}/>
              <Stack.Screen name="Match" component={MatchScreen} options={{presentation: 'transparentModal' }}/>

              </>
          ): (
              <Stack.Screen name="Login" component={LoginScreen}/>
          )}
      </Stack.Navigator>
    );
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export default StackNavigator