import { View, Text } from 'react-native';
import React from 'react';
import { Message } from '../types/types';

interface SenderMessageProps {
  message: Message;
}

const SenderMessage = ({ message }: SenderMessageProps) => {
  return (
    <View className="flex-row justify-end">
      <View className="flex-shrink-1 bg-primary-800 rounded-lg rounded-tr-none px-4 py-2 my-2 mx-1">
        <Text className='text-white'>{message?.message}</Text>
      </View>
    </View>
  )
}

export default SenderMessage