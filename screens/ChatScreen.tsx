import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  return (
    <SafeAreaView className='mt-7'>
      <Header title="Chat" callEnabled={true}/>
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen