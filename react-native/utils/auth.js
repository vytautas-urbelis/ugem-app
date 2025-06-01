// Validate password rules and match
import {campaigsStorage, campaigsVisitsStorage} from "../MMKV/mmkvBusiness/campaigns";
import {controlStorage} from "../MMKV/control";
import {authStorage} from "../MMKV/auth";
import {wallMessagesStorage} from "../MMKV/mmkvBusiness/wallMessages";
import {router} from "expo-router";
import {saveCustomerMMKV} from "../MMKV/mmkvCustomer/user";
import {saveBusinessMMKV} from "../MMKV/mmkvBusiness/user";

export const checkPassword = (password, repeatPassword, setError) => {
    if (password !== repeatPassword) {
        setError("Your passwords don't match.");
        return false;
    }
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_\-+=[\]{}|\\:;"'<>,.?/]{8,}$/;
    if (!passwordRegex.test(password)) {
        setError("Password must be at least 8 characters long, contain at least one letter and one number.");
        return false;
    }
    setError("");
    return true;
};

// Check if the email is valid
export const validateEmail = (email, setError) => {
    // Regular expression to check for a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError("Please provide a valid email address.");
        return false;
    }
    setError("");
    return true;
};

// Check if all fileds filled in
export const checkIfFilledIn = (...theArgs) => {
    let lengthOfArgs = theArgs.length / 2
    for (let i = 0; i < theArgs.length; i += 2) {
        if (!theArgs[i]) {
            theArgs[i + 1](false)
            lengthOfArgs = lengthOfArgs - 1
        } else {
            theArgs[i + 1](true)
        }
    }
    if (lengthOfArgs !== (theArgs.length / 2)) {
        return false
    } else {
        return true
    }
}

export const logOutAll = (Purchases = null, setIsLogOut, setIsLoading) => {
    setIsLoading(true);
    if (Purchases) {
        console.log('sssssss')
        Purchases.logOut()
    }
    // Simulate a logout process with a timeout
    setTimeout(() => {
        // Clear stored data in local storages
        campaigsStorage.clearAll()
        campaigsVisitsStorage.clearAll()
        controlStorage.clearAll()
        authStorage.clearAll()
        wallMessagesStorage.clearAll()
        saveCustomerMMKV('')
        saveBusinessMMKV('')

        router.replace(""); // Redirect to home screen
        setIsLogOut(false);
        setIsLoading(false);
    }, 500);

}

export const hasPermission = (profile, currentSubscription) => {
    return !(!profile.is_vip && !currentSubscription);
}