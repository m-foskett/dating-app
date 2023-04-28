import { View, SafeAreaView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import getMatchedUserInfo from '../lib/getMatchedUserInfo'
import useAuth from '../hooks/useAuth'
import { useRoute } from '@react-navigation/native'
import colours from '../config/colours'
import SenderMessage from '../components/SenderMessage'
import ReceiverMessage from '../components/ReceiverMessage'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { RootStackScreenProps } from '../types/navigationTypes'
import { Message, UserProfile } from '../types/types'
import { ArrowUpCircleIcon } from 'react-native-heroicons/solid'

const MessageScreen = () => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [matchedUser, setMatchedUser] = useState<UserProfile>(null);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Hook: useAuth()
    const { userName, userUID, } = useAuth();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Route Params
    const { params: { matchDetails }} = useRoute<RootStackScreenProps<'Message'>['route']>();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Firestore Query: Get Chat Message Data
    useEffect(() =>
        onSnapshot(
            query(
                collection(db, 'matches', matchDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            ),
            snapshot =>
                setMessages(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        timestamp: doc.get('timestamp'),
                        userId: doc.get('userId'),
                        displayName: doc.get('displayName'),
                        photoURL: doc.get('photoURL'),
                        message: doc.get('message'),
                    } as Message))
                )
        ),
        [matchDetails, db]
    );
    // Get Matched user's data
    useEffect(()=> {
        setMatchedUser(getMatchedUserInfo(matchDetails, userUID));
    }, [])
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Function: sendMessage()
    // - Sends user input as a message to Firestore
    const sendMessage = () => {
        addDoc(collection(db, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: userUID,
            displayName: userName,
            photoURL: matchDetails.users[userUID].photoURL,
            message: input,
        });
        // Reset the keyboard input to empty
        setInput("");
        Keyboard.dismiss();
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
        // Base Container
        <SafeAreaView className='flex-1 mt-7 bg-primary-50'>
            {/* Custom Header Component */}
            <Header
                callEnabled
                title={matchedUser?.displayName}
                pictureEnabled
                picture={matchedUser?.photoURL}
            />
            <KeyboardAvoidingView
                className='flex-1'
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={10}
            >
                {/* Keyboard Dismiss */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {/* Chat */}
                    <FlatList
                        data={messages}
                        inverted={true}
                        className='pl-4 mb-[20px]'
                        keyExtractor={item => item.id}
                        renderItem={({item: message}) =>
                            message.userId === userUID ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        }
                    />
                </TouchableWithoutFeedback>
                {/* Typing Bar */}
                <View className='flex-row items-center w-[100%] px-[15px] pb-[15px]'>
                    <TextInput
                        className='h-[40px] flex-1 mr-[15px] border-transparent bg-primary-200 border-[1px] p-[10px] text-primary-950 rounded-[30px]'
                        placeholder='Send a message'
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={sendMessage}
                    />
                    {/* Send Message Button */}
                    <TouchableOpacity onPress={sendMessage}>
                        <ArrowUpCircleIcon color={colours.primary[950]} size={34}/>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

export default MessageScreen