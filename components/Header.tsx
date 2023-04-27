import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { ChevronLeftIcon, PhoneArrowUpRightIcon } from 'react-native-heroicons/solid'
import { useNavigation } from '@react-navigation/native'
import colours from '../config/colours'

interface HeaderProps {
  title: string;
  callEnabled: boolean;
}

const Header = ({ title, callEnabled }: HeaderProps) => {
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
          {/* Header Title */}
          <Text className='text-primary-950 text-2xl font-bold pl-2'>{title}</Text>
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