import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ChevronLeftIcon, PhoneArrowUpRightIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import colours from '../config/colours'

interface HeaderProps {
  title: string;
  callEnabled: boolean;
  pictureEnabled?: boolean;
  picture?: string;
}

const Header = ({ title, callEnabled, pictureEnabled, picture }: HeaderProps) => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navigation Prop
    const navigation = useNavigation();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
      // Header Container
      <View className='flex-row items-center justify-between p-2'>
        <View className='flex flex-row items-center'>
          {/* Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
              <ChevronLeftIcon size={34} color={colours.primary[400]}/>
          </TouchableOpacity>
          {/* Picture */}
          {pictureEnabled && (
            <Image className='h-10 w-10 rounded-full' source={{uri: picture}} />
          )}
          {/* Header Title */}
          <Text className='text-primary-950 text-2xl font-bold pl-3'>{title}</Text>
        </View>
        {/* Call Button */}
        {callEnabled && (
          <TouchableOpacity className='rounded-full mr-4 p-3 bg-red-200'>
              <PhoneArrowUpRightIcon size={20} color={colours.primary[400]} />
          </TouchableOpacity>
        )}
      </View>
    )
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default Header