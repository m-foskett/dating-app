import { Text, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native'
import React, {useState } from 'react'
import useAuth from '../hooks/useAuth'
import { useNavigation } from '@react-navigation/native';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import colours from '../config/colours';

const ModalScreen = () => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [image, setImage] = useState<string>(null);
    const [occupation, setOccupation] = useState<string>(null);
    const [age, setAge] = useState<string>(null);
    const incompleteForm = !image || !occupation || !age;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Hook: useAuth()
    const { userName, userUID } = useAuth();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navigation Prop
    const navigation = useNavigation();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Function: updateUserProfile()
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
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
        // Base Container
        <SafeAreaView className='flex-1 pt-7 bg-primary-50'>
            <KeyboardAvoidingView
                className='flex-1 items-center'
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={5}
            >
                {/* Keyboard Dismiss */}
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                    <>
                        {/* Logo Image */}
                        <Image
                            className='h-20 w-52'
                            resizeMode='contain'
                            source={require('../assets/placeholder_logo.jpg')}
                        />
                        {/* Welcome Message */}
                        <Text className='text-xl text-primary-500 p-2 font-bold'>Welcome {userName}!</Text>
                        {/* Profile Pic Title */}
                        <Text className='text-xl text-center p-4 font-bold text-primary-400'>Add a Profile Pic</Text>
                        {/* Profile Pic Input */}
                        <TextInput
                            value={image}
                            onChangeText={setImage}
                            className='text-center text-xl pb-2'
                            placeholder='Enter a Profile Pic URL'
                            placeholderTextColor={colours.primary[950]}
                        />
                        {/* Occupation Title */}
                        <Text className='text-xl text-center p-4 font-bold text-primary-400'>Add your Occupation</Text>
                        {/* Occupation Input */}
                        <TextInput
                            value={occupation}
                            onChangeText={setOccupation}
                            className='text-center text-xl pb-2'
                            placeholder='Enter your occupation'
                            placeholderTextColor={colours.primary[950]}
                        />
                        {/* Age Title */}
                        <Text className='text-xl text-center p-4 font-bold text-primary-400'>Add your Age</Text>
                        {/* Age Input */}
                        <TextInput
                            value={age}
                            onChangeText={setAge}
                            className='text-center text-xl pb-2'
                            placeholder='Enter your age'
                            placeholderTextColor={colours.primary[950]}
                            keyboardType='numeric'
                            maxLength={2}
                        />
                    </>
                </TouchableWithoutFeedback>
                {/* Update User Profile Button */}
                <TouchableOpacity
                    onPress={updateUserProfile}
                    disabled={incompleteForm}
                    className={incompleteForm ? "bg-gray-400 w-64 p-3 rounded-xl" : "bg-primary-950 w-64 p-3 rounded-xl"}>
                    <Text className='text-center text-white text-xl'>Update Profile</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ModalScreen