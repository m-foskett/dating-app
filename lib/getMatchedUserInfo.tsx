import { Match, UserProfile } from "../types/types";
// Custom Function: getMatchedUserInfo
// - Extract the matched user's data as type UserProfile
const getMatchedUserInfo = (match: Match, userLoggedIn: string,) => {
    const loggedInUserIndex: number = match.usersMatched.indexOf(userLoggedIn);
    const matchedUserId: string = match.usersMatched.slice(0, loggedInUserIndex).concat(match.usersMatched.slice(loggedInUserIndex+1))[0];
    const matchedUser: UserProfile = match.users[matchedUserId];
    return matchedUser;
}

export default getMatchedUserInfo;