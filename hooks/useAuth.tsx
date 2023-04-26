import { View, Text } from 'react-native'
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
// import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { auth } from "../firebase"

WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({
// Initial State of Context
})
// Maybe add expoClientId
const config = {
    androidClientId: "690008863159-6t38dunonnp13ogkeo8uim7a92g6vjuu.apps.googleusercontent.com",
    expoClientId: "690008863159-butstt5apsplg14mc6tuchk1jasjdn0e.apps.googleusercontent.com",
    webClientId: "690008863159-oadl46giabf6k62507dplic3t0ll3dv9.apps.googleusercontent.com",
    responseType: "id_token",
}

export const AuthProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);
    const [userPhoto, setUserPhoto] = useState(null);
    const [userUID, setUserUID] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // async ()
    // const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    //     {
    //     clientId: config.androidClientId,
    //     },
    // );
    // Maybe add redirect uri with the make uri function
    const [request, response, promptAsync] = Google.useAuthRequest(config);

    async function signInWithGoogle () {
        setLoading(true);
        await promptAsync();
    }

    const logout = () => {
        setLoading(true);
        signOut(auth)
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    };

    React.useEffect(() => {
        if (response?.type === 'success') {
        const { id_token } = response.params;
        // const auth = getAuth();
        //   If successful Google sign in, create a credential and sign in with Firebase Authentication
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential);
        setLoading(false);
        }
    }, [response]);

    // On detecting a change in the authentication state, set the user's properties then set the loading phase to false to avoid UI delay
    // Implicitly returns an unsubscribe to cleanup event listener
    useEffect(() =>
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Logged in
                setUserName(user.displayName);
                setUserPhoto(user.photoURL);
                setUserUID(user.uid);
                // console.log(user);
            } else {
                setUserName(null);
                // setUserPhoto(null);
            }

            setLoadingInitial(false);
        }),
        []
    );

    // Caches values to reduce rerendering of unchanged variables
    // const memoedValue = useMemo(() => ({
    //     userName,
    //     userPhoto,
    //     userUID,
    //     loading,
    //     logout,
    //     error,
    //     signInWithGoogle,
    // }), [userName, loading, error]);


    return (
        <AuthContext.Provider
            value={{
                userName,
                userPhoto,
                userUID,
                loading,
                logout,
                error,
                signInWithGoogle,
            }}
        >
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}