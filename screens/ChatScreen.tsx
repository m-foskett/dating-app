import { SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import ChatList from '../components/ChatList'

const ChatScreen = () => {
  return (
    <SafeAreaView className='flex-1 mt-7 bg-primary-50'>
      {/* Custom Header Component */}
      <Header title="Chat" callEnabled={true}/>
      {/* Custom ChatList Component */}
      <ChatList />
    </SafeAreaView>
  )
}

export default ChatScreen