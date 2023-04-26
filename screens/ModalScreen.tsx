import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'
import React, {useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ModalScreen = () => {
    const { userName, userUID } = useAuth();
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [occupation, setOccupation] = useState(null);
    const [age, setAge] = useState(null);
    const incompleteForm = !image || !occupation || !age;

    const updateUserProfile = () => {
        setDoc(doc(db, 'users', userUID), {
            id: userUID,
            displayName: userName,
            photoURL: image,
            occupation: occupation,
            age: age,
            timestamp: serverTimestamp()
        }).then(() => {
            navigation.navigate("Home")
        }).catch(error => {
            alert(error.message);
        });
    };

    return (
        <View className='flex-1 items-center pt-7'>
            <Image
                className='h-20 w-52'
                resizeMode='contain'
                source={require('../assets/placeholder_logo.jpg')}
            />
            <Text className='text-xl text-gray-500 p-2 font-bold'>Welcome {userName}</Text>
            <Text className='text-xl text-center p-4 font-bold text-red-400'>Step 1: The Profile Pic</Text>
            <TextInput
                value={image}
                onChangeText={setImage}
                className='text-center text-xl pb-2'
                placeholder='Enter a Profile Pic URL'
            />
            <Text className='text-xl text-center p-4 font-bold text-red-400'>Step 2: Occupation</Text>
            <TextInput
                value={occupation}
                onChangeText={setOccupation}
                className='text-center text-xl pb-2'
                placeholder='Enter your occupation'
            />
            <Text className='text-xl text-center p-4 font-bold text-red-400'>Step 3: Age</Text>
            <TextInput
                value={age}
                onChangeText={setAge}
                className='text-center text-xl pb-2'
                placeholder='Enter your age'
                keyboardType='numeric'
                maxLength={2}
            />
            <TouchableOpacity
                onPress={updateUserProfile}
                disabled={incompleteForm}
                className={incompleteForm ? "bg-gray-400 w-64 p-3 rounded-xl absolute bottom-10" : "bg-red-400 w-64 p-3 rounded-xl absolute bottom-10"}>
                <Text className='text-center text-white text-xl'>Update Profile</Text>
            </TouchableOpacity>
        </View>
    )
}

export default ModalScreen