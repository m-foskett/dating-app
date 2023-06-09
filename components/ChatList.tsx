import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';
import colours from '../config/colours';
import { Match } from '../types/types';

const ChatList = () => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [matches, setMatches] = useState<Match[]>([]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Hook: useAuth()
    const { userUID } = useAuth();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Firestore Query: Get a list of all the users matches
    useEffect(() =>
        onSnapshot(
            query(
                collection(db, 'matches'),
                where('usersMatched', 'array-contains', userUID)
            ),
            snapshot =>
                setMatches(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        users: doc.get('users'),
                        usersMatched: doc.get('usersMatched'),
                        timestamp: doc.get('timestamp'),
                    }))
                )
        ),
        [userUID]
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return matches.length > 0 ?
        (
            // List of Chats
            <FlatList
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails={item}/>}
                style={{backgroundColor: colours.primary[50]}}
            />
        ) : (
            // No Matches Yet!
            <View className='p-5'>
                <Text className=' text-primary-950 text-center text-lg'>No matches yet!</Text>
            </View>
        );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
};

export default ChatList