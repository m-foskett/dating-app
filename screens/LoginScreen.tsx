import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import useAuth from '../hooks/useAuth'

const LoginScreen = () => {
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Custom Auth Hook: useAuth()
  const { signInWithGoogle, } = useAuth();
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  return (
    <View className='flex-1'>
      {/* Image Background */}
      <ImageBackground
        resizeMode='cover'
        className="flex-1"
        source={require('../assets/login_bg.png')}
      >
        <TouchableOpacity className="absolute left-20 bottom-40 w-52 bg-primary-950 p-4 rounded-2xl" onPress={signInWithGoogle}>
          <Text className='text-white text-md font-semibold text-center'>Sign in to start dating!</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  )
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default LoginScreen