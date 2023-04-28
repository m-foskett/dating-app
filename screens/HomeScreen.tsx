import { View, Text, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { ChatBubbleLeftRightIcon, HeartIcon, XMarkIcon } from "react-native-heroicons/solid";
import Swiper from 'react-native-deck-swiper';
import colours from '../config/colours';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';
import { UserProfile } from '../types/types';

const HomeScreen = () => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Hook: useAuth()
    const { userPhoto, userUID, logout } = useAuth();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Navigation Prop
    const navigation = useNavigation();
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Reference to Swiper object
    const swipeRef = useRef(null);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // When the component renders, navigate to Create Profile Modal if user doesn't exist inside Firestore
    useLayoutEffect(() => onSnapshot(doc(db, 'users', userUID), snapshot => {
            if(!snapshot.exists()){
                navigation.navigate('Modal');
            }
        }),
        []
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Firestore Query: Get a list of all the likes, passes and new profiles
    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            const passes = await getDocs(collection(db, 'users', userUID, 'passes')).then((snapshot) => snapshot.docs.map((doc) => doc.id));
            const likes = await getDocs(collection(db, 'users', userUID, 'likes')).then((snapshot) => snapshot.docs.map((doc) => doc.id));
            const passedUserIds = passes.length > 0 ? passes : ['test'];
            const likedUserIds = likes.length > 0 ? likes : ['test'];

            unsub = onSnapshot(
                query(collection(db, 'users'), where('id', 'not-in', [...passedUserIds, ...likedUserIds ])),
                snapshot => {
                    setProfiles(snapshot.docs.filter(doc => doc.id !== userUID).map(doc => ({
                        id: doc.id,
                        displayName: doc.get('displayName'),
                        photoURL: doc.get('photoURL'),
                        occupation: doc.get('occupation'),
                        age: doc.get('age'),
                        timestamp: doc.get('timestamp'),
                        } as UserProfile))
                    );
                }
            );
        };
        fetchCards();
        return unsub;
    }, []);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Function: swipeLeft()
    const swipeLeft = (cardIndex: number) => {
        // If the profile index isn't found, return
        if (!profiles[cardIndex]) return;
        // Get all relevant user data
        const userSwiped = profiles[cardIndex];
        // Set the user's info inside the 'passes' collection
        setDoc(doc(db, 'users', userUID, 'passes', userSwiped.id), userSwiped);
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Custom Function: swipeRight()
    const swipeRight = async (cardIndex: number) => {
        // If the profile index isn't found, return
        if (!profiles[cardIndex]) return;
        // Get all relevant user data
        const userSwiped = profiles[cardIndex];
        // Get the logged in user's data
        const loggedInProfile = (await getDoc(doc(db, 'users', userUID))).data() as UserProfile;
        // Matching Function (Check if other user swiped on you)
        // NOTE: In production, this would be done as a cloud function, not on client side as users shouldn't have access to
        // other users' pass/like data
        getDoc(doc(db, 'users', userSwiped.id, 'likes', userUID))
            .then((documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    // Set the user's info inside the 'likes' collection
                    setDoc(doc(db, 'users', userUID, 'likes', userSwiped.id), userSwiped);
                    // User has also liked you
                    // Create a MATCH
                    setDoc(doc(db, 'matches', generateId(userUID, userSwiped.id)), {
                        users: {
                            [userUID]: loggedInProfile,
                            [userSwiped.id]: userSwiped,
                        },
                        usersMatched: [userUID, userSwiped.id],
                        timestamp: serverTimestamp(),
                    });
                    navigation.navigate('Match', {loggedInProfile, userSwiped});
                } else {
                    // Logged-In user has liked (creating first interaction) or Liked User did not like Logged-In user
                    // Set the user's info inside the 'likes' collection
                    setDoc(doc(db, 'users', userUID, 'likes', userSwiped.id), userSwiped);
                }
            });
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return (
        // Base Container
        <SafeAreaView className='flex-1 mt-7 bg-primary-50'>
            {/* Header */}
            <View className='flex-row items-center justify-between px-5'>
                {/* Logout Button */}
                <TouchableOpacity onPress={() => logout()}>
                    <Image
                        className='h-10 w-10 rounded-full'
                        source={{uri: userPhoto}}
                    />
                </TouchableOpacity>
                {/* Update Profile Modal */}
                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                    <Image
                        className='h-20 w-52'
                        resizeMode='contain'
                        source={require("../assets/placeholder_logo.jpg")}
                    />
                </TouchableOpacity>
                {/* Navigate to Chat Screen Button */}
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <ChatBubbleLeftRightIcon color={colours.primary[950]} size={40}/>
                </TouchableOpacity>
            </View>
            {/* Deck Swiper */}
            <View className='flex-1 -mt-6'>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{backgroundColor: "transparent"}}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        swipeRight(cardIndex);
                    }}
                    overlayLabels={{
                        left: {
                            title: "NOPE",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "YEAH!",
                            style: {
                                label: {
                                    textAlign: "left",
                                    color: "green",
                                },
                            },
                        },
                    }}
                    renderCard={(card) => card ? (
                        // Render Profile Cards
                        <View className='bg-primary-100'>
                            <View key={card.id} className='items-center justify-center relative bg-primary-200 h-3/4 rounded-xl' >
                                <Image className=' h-[95%] w-[95%] rounded-xl' source={{uri: card.photoURL}} />
                            </View>
                            <View
                                style={styles.cardShadow}
                                className='absolute bottom-0 bg-primary-200 w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl'
                            >
                                <View className='flex-1 justify-evenly'>
                                    <Text className='text-primary-800 text-2xl font-bold'>{card.displayName}</Text>
                                    <Text className='text-primary-800 text-lg font-bold'>{card.occupation}</Text>
                                </View>
                                <Text className='text-primary-800 text-2xl font-bold'>{card.age}</Text>
                            </View>
                        </View>
                    ): (
                        // Out of Profiles Card
                        <View style={styles.cardShadow} className='relative bg-primary-100 h-3/4 rounded-xl justify-center items-center' >
                            <Text className='text-primary-950 font-bold pb-5'>Out of Profiles</Text>
                            <Image
                                className='h-20 w-28'
                                source={require("../assets/feelsbadman.png")}
                            />
                        </View>
                    )}
                />
            </View>
            {/* Swipe Alternative Buttons */}
            <View className='flex flex-row justify-evenly mb-6'>
                {/* Nope Alternative Button */}
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-red-300'
                >
                    <XMarkIcon color={colours.primary[600]} size={24} />
                </TouchableOpacity>
                {/* Yeah Alternative Button */}
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-green-300'
                >
                    <HeartIcon color={colours.green} size={24} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen

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