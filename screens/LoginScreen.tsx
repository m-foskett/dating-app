import { View, Text, Button, ImageBackground, TouchableOpacity } from 'react-native'
import React, { useLayoutEffect } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Navigation Prop
  const navigation = useNavigation();
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Custom Auth Hook: useAuth()
  const { signInWithGoogle, } = useAuth();
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <View className='flex-1'>
      <ImageBackground
        resizeMode='cover'
        className="flex-1"
        source={{ uri: "https://tinder.com/static/tinder.png"}}
      >
        <TouchableOpacity className="absolute left-20 bottom-40 w-52 bg-white p-4 rounded-2xl" onPress={signInWithGoogle}>
          <Text className='font-semibold text-center'>Sign in and start dating!</Text>
        </TouchableOpacity>

      </ImageBackground>
      {/* <Text>{loading ? "Loading..." : "Login to App"}</Text>
      <Button title='Login' onPress={() => {signInWithGoogle();}}></Button> */}
    </View>
  )
}

export default LoginScreen