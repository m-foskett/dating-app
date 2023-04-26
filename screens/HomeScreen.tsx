import { View, Text, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/useAuth';
import { ChatBubbleLeftRightIcon, HeartIcon, XMarkIcon } from "react-native-heroicons/solid";
import Swiper from 'react-native-deck-swiper';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import colours from '../config/colours';
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';
import generateId from '../lib/generateId';

const DUMMY_DATA = [
    {
        firstName: "Bob",
        lastName: "Bobson",
        occupation: "Software Developer",
        photoURL: require("../assets/jorji.jpg"),
        age: 55,
        id: 123,
    },
    {
        firstName: "Becky",
        lastName: "Becker",
        occupation: "Personal Assistant",
        photoURL: require("../assets/becky.jpg"),
        age: 25,
        id: 456,
    },
    {
        firstName: "Stacy",
        lastName: "Smith",
        occupation: "Influencer",
        photoURL: require("../assets/stacy.jpg"),
        age: 21,
        id: 789,
    },
];

const HomeScreen = () => {
    const { userName, userPhoto, userUID, logout } = useAuth();
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    // Reference to Swiper object
    const swipeRef = useRef(null);

    // When Component renders
    useLayoutEffect(() => onSnapshot(doc(db, 'users', userUID), snapshot => {
            if(!snapshot.exists()){
                navigation.navigate('Modal');
            }
        }),
        []
    );
    // When HomeScreen mounts
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
                        ...doc.data(),
                        }))
                    );
                }
            );
            console.log(passedUserIds);
        };

        fetchCards();
        return unsub;
    }, []);

    const swipeLeft = (cardIndex) => {
        // If the profile index isn't found, return
        if (!profiles[cardIndex]) return;
        // Get all relevant user data
        const userSwiped = profiles[cardIndex];
        console.log(`You passed on ${userSwiped.displayName}`);
        // Set the user's info inside the 'passes' collection
        setDoc(doc(db, 'users', userUID, 'passes', userSwiped.id), userSwiped);
    }

    const swipeRight = async (cardIndex) => {
        // If the profile index isn't found, return
        if (!profiles[cardIndex]) return;
        // Get all relevant user data
        const userSwiped = profiles[cardIndex];
        //
        const loggedInProfile = await (await getDoc(doc(db, 'users', userUID))).data();
        // Matching Function (Check if other user swiped on you)
        // NOTE: In production, this would be done as a cloud function, not on client side as users shouldn't have access to
        // other users' pass/like data
        getDoc(doc(db, 'users', userSwiped.id, 'likes', userUID))
            .then((documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    // Set the user's info inside the 'likes' collection
                    setDoc(doc(db, 'users', userUID, 'likes', userSwiped.id), userSwiped);
                    // User has also liked you
                    console.log(`You have matched with ${userSwiped.displayName}!`);
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
                    console.log(`You liked ${userSwiped.displayName}`);
                    // Set the user's info inside the 'likes' collection
                    setDoc(doc(db, 'users', userUID, 'likes', userSwiped.id), userSwiped);
                }
            });
    };

    return (
        <SafeAreaView className='flex-1 mt-7'>
            {/* Header */}
            <View className='flex-row items-center justify-between px-5'>
                <TouchableOpacity onPress={() => logout()}>
                    <Image
                        className='h-10 w-10 rounded-full'
                        source={{uri: userPhoto}}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                    <Image
                        className='h-14 w-14'
                        source={require("../assets/bp_logo.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <ChatBubbleLeftRightIcon color="black" size={40}/>
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
                        console.log('NOPED')
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("YEP'D")
                        swipeRight(cardIndex);
                    }}
                    overlayLabels={{
                        left: {
                            title: "BRUTAL",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red",
                                },
                            },
                        },
                        right: {
                            title: "OH BABY",
                            style: {
                                label: {
                                    textAlign: "left",
                                    color: "green",
                                },
                            },
                        },
                    }}
                    renderCard={(card) => card ? (

                        <View>
                            <View key={card.id} className='relative bg-white h-3/4 rounded-xl' >
                                <Image className='absolute top-0 h-full w-full rounded-xl' source={{uri: card.photoURL}} />
                            </View>
                            <View
                                style={styles.cardShadow}
                                className='absolute bottom-0 bg-white w-full h-20 justify-between items-center flex-row px-6 py-2 rounded-b-xl'>
                                    <View>
                                        <Text className='text-xl font-bold'>{card.displayName}</Text>
                                        <Text>{card.occupation}</Text>
                                    </View>
                                    <Text className='text-2xl font-bold'>{card.age}</Text>
                            </View>
                        </View>
                    ): (
                        <View style={styles.cardShadow} className='relative bg-white h-3/4 rounded-xl justify-center items-center'>
                            <Text className='font-bold pb-5'>Out of Profiles</Text>
                            <Image
                                className='h-20 w-28'
                                source={require("../assets/feelsbadman.png")}
                            />
                        </View>
                    )}
                />
            </View>

            <View className='flex flex-row justify-evenly'>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeLeft()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-red-300'>
                    <XMarkIcon color={colours.red} size={24}/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swipeRef.current.swipeRight()}
                    className='items-center justify-center rounded-full w-16 h-16 bg-green-300'>
                    <HeartIcon color={colours.green} size={24}/>
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