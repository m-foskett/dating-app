// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Type Checking
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
export type AuthContextType = {
    userName: string | null;
    userPhoto: string | null;
    userUID: string;
    loading: boolean;
    error: string;
    signInWithGoogle: () => void;
    logout: () => void;
  };

//   export interface Message {
//     id: string;
//     timestamp: string;
//     userId: string;
//     displayName: string;
//     photoURL: string;
//     message: string;
//   };

//   export interface Chat {
//     id: string;
//     chatName: string;
//     timestamp: string;
//     chatPhotoURL: string;
//   };
