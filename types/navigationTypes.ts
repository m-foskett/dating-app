// See the RN Navigation Docs for implementation details
// https://reactnavigation.org/docs/typescript/#specifying-default-types-for-usenavigation-link-ref-etc

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserProfile } from './types';

export type RootStackParamList = {
    Home: undefined;
    Chat: undefined;
    Message: undefined;
    Match: {
        loggedInProfile: UserProfile;
        userSwiped: UserProfile;
    };
    Modal: undefined;
    Login: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}