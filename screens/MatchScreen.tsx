import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RootStackScreenProps } from '../types/navigationTypes';

const MatchScreen = () => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navigation Prop
    const navigation = useNavigation();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Route Params
    const { params: { loggedInProfile, userSwiped }} = useRoute<RootStackScreenProps<'Match'>['route']>();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
        // Base Container
        <View className='flex-1 items-center h-full bg-primary-600 pt-20 flex-shrink' style={{opacity: 0.89,}}>
            {/* Its a Match Image */}
            <View className='justify-center px-10 pt-20'>
                <Image className='w-48 h-12' source = {require('../assets/its_a_match.png')} />
            </View>
            {/* Matched Statement */}
            <Text className='text-primary-50 text-center text-lg mt-5'>
                You have matched with {userSwiped.displayName}!
            </Text>
            {/* User Images */}
            <View className='flex-row items-center space-x-5 mt-5'>
                <Image className='h-32 w-32 rounded-full' source={{uri: loggedInProfile.photoURL}} />
                <Image className='h-32 w-32 rounded-full' source={{uri: userSwiped.photoURL}} />
            </View>
            {/* Start Chatting Button */}
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack();
                    navigation.navigate("Chat");
                }}
                className='bg-primary-950 m-5 px-5 py-5 rounded-full mt-20'>
                <Text className='text-center text-primary-50 text-lg'>Start chatting!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MatchScreen