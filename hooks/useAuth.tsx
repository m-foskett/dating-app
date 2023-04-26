import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, signOut } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { auth } from "../firebase"
import { AuthContextType } from '../types/types';
import PropTypes from "prop-types";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
WebBrowser.maybeCompleteAuthSession(); // Not sure if needed
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Auth Configuration
const config = {
    androidClientId: "690008863159-6t38dunonnp13ogkeo8uim7a92g6vjuu.apps.googleusercontent.com",
    expoClientId: "690008863159-butstt5apsplg14mc6tuchk1jasjdn0e.apps.googleusercontent.com",
    webClientId: "690008863159-oadl46giabf6k62507dplic3t0ll3dv9.apps.googleusercontent.com",
    responseType: "id_token",
}
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Context for Auth
// Initial state of null
const AuthContext = createContext<AuthContextType | null>(null);
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom HOC - AuthProvider
// Uses children prop (the Stack Navigator)
export const AuthProvider = ({ children }) => {
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // State Variables
    const [userName, setUserName] = useState<string | null>(null);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [userUID, setUserUID] = useState<string>(null);
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Login via Google Auth:
    // Load an authorization request.
    // Returns: loaded request, response, prompt method
    // When the prompt method completes, then the response will be fulfilled.
    const [request, response, promptAsync] = Google.useAuthRequest(config);
    async function signInWithGoogle() {
        setLoading(true);
        if (request) {
          await promptAsync();
        }
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Logout Function
    const logout = () => {
        setLoading(true);
        signOut(auth)
        .catch((error) => setError(error))
        .finally(() => setLoading(false));
    };
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            // const auth = getAuth();
            // If successful Google sign in, create a credential and sign in with Firebase Authentication
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential);
            setLoading(false);
        }
    }, [response]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // On detecting a change in the authentication state, set the user's properties then set the loading phase to false to avoid UI delay
    // Implicitly returns an unsubscribe to cleanup event listener
    useEffect(() => {
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
        })
    }, [auth]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Caches values to reduce rerendering of unchanged variables
    const memoedValue = useMemo(() => ({
        userName,
        userPhoto,
        userUID,
        loading,
        logout,
        error,
        signInWithGoogle,
    }), [userName, loading, error]);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Custom Hook - useAuth()
export default function useAuth() {
    return useContext(AuthContext);
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~