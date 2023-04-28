import { View, Text } from 'react-native';
import React from 'react';
import { Message } from '../types/types';

interface ReceiverMessageProps {
  message: Message;
}

const ReceiverMessage = ({ message }: ReceiverMessageProps) => {
  return (
    <View className="flex-row justify-start">
      <View className="flex-shrink-1 relative bg-primary-400 rounded-lg rounded-tl-none px-4 py-2 my-2 mx-1">
        <Text className='text-white'>{message?.message}</Text>
      </View>
    </View>
  )
}

export default ReceiverMessage