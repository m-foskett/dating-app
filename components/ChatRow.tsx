import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Match, UserProfile } from '../types/types';

interface ChatRowProps {
  matchDetails: Match;
}

const ChatRow = ({ matchDetails }: ChatRowProps) => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [matchedUserInfo, setMatchedUserInfo] = useState<UserProfile>(null);
    const [lastMessage, setLastMessage] = useState<string>('');
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navigation Prop
    const navigation = useNavigation();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Hook: useAuth()
    const { userUID } = useAuth();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Extract the matched user's info using custom function
    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails, userUID));
    }, [matchDetails, userUID]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Firestore Query: Get the last chat message sent if it exists
    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, 'matches', matchDetails.id, 'messages'),
                    orderBy('timestamp', 'desc')
                ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
            ),
        [matchDetails, db]
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
      // Base Container
      <TouchableOpacity
          onPress={() => navigation.navigate('Message', {matchDetails})}
          style={styles.cardShadow}
          className='flex-row items-center py-3 px-5 bg-primary-200 mx-3 my-1 rounded-lg'
        >
        {/* Matched User Image */}
        <Image
          className='rounded-full h-16 w-16 mr-4'
          source={{uri: matchedUserInfo?.photoURL}}
        />
        {/* Chat Row Content */}
        <View className='flex-1'>
          {/* Matched User Name */}
          <Text className='text-primary-950 text-lg font-semibold'>
              {matchedUserInfo?.displayName}
          </Text>
          {/* Last Message Sent */}
          <Text className='text-md'>
            {lastMessage || "Be the first to message!"}
          </Text>
        </View>
      </TouchableOpacity>
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
};

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});