import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth';
import ChatRow from './ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const { userUID } = useAuth();

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
                        ...doc.data(),
                    }))
                )
        ),
        [userUID]
    );

    return matches.length > 0 ? (
            <FlatList
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails={item}/>}
            />
        ) : (
            <View className='p-5'>
                <Text className='text-center text-lg'>BRUUUUUUTAL!</Text>
            </View>
        );
}

export default ChatList