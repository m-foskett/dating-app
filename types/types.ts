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

  export interface UserProfile {
    id: string;
    age: number;
    displayName: string;
    occupation: string;
    photoURL: string;
    timestamp: string;
  };

  export interface Match {
    id: string;
    timestamp: number;
    usersMatched: string[];
    users: {
      user1: UserProfile;
      user2: UserProfile;
    }
  };

//   export interface Chat {
//     id: string;
//     chatName: string;
//     timestamp: string;
//     chatPhotoURL: string;
//   };
