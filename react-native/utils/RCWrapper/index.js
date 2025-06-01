import React, {createContext, useContext, useEffect, useState} from "react";
import {controlStorage} from "../../MMKV/control";
import {getBusinessMMKV} from "../../MMKV/mmkvBusiness/user";
import RevenueCatUI from "react-native-purchases-ui";
import {Platform} from "react-native";
import Purchases from "react-native-purchases";
import {useMMKVBoolean} from "react-native-mmkv";
import {updateAccount} from "../../axios/axiosBusiness/businessAuth";
import {authStorage} from "../../MMKV/auth";

const RevenueCatContext = createContext(null);

export function RevenueCatProvider({children}) {
    Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);

    const businessAccount = controlStorage.getBoolean("businessIsLogedIn");
    const businessProfile = getBusinessMMKV();

    const userId = Platform.OS === "ios" ? `ios_${businessProfile?.id}` : Platform.OS === "android" ? `android_${businessProfile?.id}` : 'guest_user';

    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isReturningUser, setIsReturningUser] = useState(false);
    const [offerings, setOfferings] = useState(null);
    const [products, setProducts] = useState(null);
    const [currentSubscription, setCurrentSubscription] = useState(false);
    const [isInFreeTrial, setIsInFreeTrial] = useState(false);

    const [isRevenueCatConfigured, setIsRevenueCatConfigured] = useMMKVBoolean('isRevenueCatConfigured', controlStorage);
    const [refreshBusinessFeed, setRefreshBusinessFeed] = useMMKVBoolean("refreshBusinessFeed", controlStorage);

    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        setIsRevenueCatConfigured(false)
        const init = async () => {
            if (businessAccount && userId) {
                try {
                    if (Platform.OS === "ios") {
                        Purchases.configure({apiKey: process.env.EXPO_PUBLIC_RC_IOS, appUserID: userId});
                    } else if (Platform.OS === "android") {
                        Purchases.configure({apiKey: process.env.EXPO_PUBLIC_RC_ANDROID, appUserID: userId});
                    }

                } catch (error) {
                    console.log("RevenueCat initialization error:", error);
                }
                await getOfferings()
                await getProducts()
                await getCurrentSubscription()
                // addSubscriptionChangeListener()
                setRefreshBusinessFeed(!refreshBusinessFeed)
                setIsRevenueCatConfigured(true)
            }
        };
        Purchases.addCustomerInfoUpdateListener(addSubscriptionChangeListener)
        init();

        return () => {
            // Cleanup the listener on component unmount
            console.log('removing listener')
            Purchases.removeCustomerInfoUpdateListener(addSubscriptionChangeListener);
        };
    }, []);

    const addSubscriptionChangeListener = async info => {
        const customerInfo = await Purchases.getCustomerInfo();
        // setIsRevenueCatConfigured(false)
        console.log(customerInfo);

        // Update state when subscription status changes
        const hasActiveSubscription = customerInfo.activeSubscriptions.length > 0;
        setIsSubscribed(hasActiveSubscription);

        console.log("Updated Subscription Status:", {
            isSubscribed: hasActiveSubscription,
        });
        try {
            // Updating users subscription field in database
            await updateAccount(accessToken, {subscription: hasActiveSubscription})

            // Updating current subscription, offerings and products
            await getOfferings()
            await getProducts()
            await getCurrentSubscription()
        } catch (error) {
            console.log(error.response.data);
        }

        setIsRevenueCatConfigured(true)
    };

    const checkUserSubscriptionStatus = async () => {
        try {
            const customerInfo = await Purchases.getCustomerInfo();

            // Check if the user has an active subscription
            const hasActiveSubscription = customerInfo.activeSubscriptions.length > 0;
            setIsSubscribed(hasActiveSubscription);

            // Check if the user has a canceled subscription in the past
            const hasPastSubscription = customerInfo.allPurchasedProductIdentifiers.length > 0;
            setIsReturningUser(hasPastSubscription);

            if (hasActiveSubscription) {
                // Active subscriber - No paywall needed
                // console.log("User has an active subscription");
                return true
            } else if (hasPastSubscription) {
                // Returning user - Show paywall for returning users
                presentPaywall(offerings.all.returning_users_offering);
                // console.log("User had an subscription");
            } else {
                // Newcomer - Show paywall for new users
                presentPaywall(offerings.all.newcomers_offering);
                // console.log("User is new");
            }
        } catch (error) {
            console.error("Error checking subscription status:", error);
        }
    };

    const presentPaywall = async (entitlementIdentifier) => {
        try {
            await RevenueCatUI.presentPaywall({
                offering: entitlementIdentifier // Optional Offering object obtained through getOfferings
            });
        } catch (error) {
            console.error("Error presenting paywall:", error);
        }
    };

    const getOfferings = async () => {
        try {
            const offeringsData = await Purchases.getOfferings();
            setOfferings(offeringsData);
            return offeringsData;
        } catch (error) {
            console.error("Error fetching offerings:", error);
            return null;
        }
    };

    const getProducts = async (productIdentifiers = ["001", "002"]) => {
        try {
            const products = await Purchases.getProducts(productIdentifiers);
            setProducts(products)
            // console.log(products);
            return products
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    };

    // function extractIds(inputArray) {
    //     // Extracts the part before the colon from each string in the array
    //     return inputArray.map(item => item.split(':')[0]);
    // }

    const getCurrentSubscription = async () => {

        try {
            const customerInfo = await Purchases.getCustomerInfo();
            const currentSubscription = customerInfo.entitlements.active?.returning_user_paywall?.productIdentifier
            
            if (currentSubscription) {
                // const customerSub = await Purchases.getProducts([currentSubscription])
                setCurrentSubscription(currentSubscription)
            } else {
                setCurrentSubscription(false)
                return false;
            }
            // if (currentSubscription.length > 0) {
            //     try {
            //         if (Platform.OS === "android") {
            //             const ids = extractIds(currentSubscription)
            //             const customerSub = await Purchases.getProducts(ids)
            //             setCurrentSubscription(customerSub)
            //         } else if (Platform.OS === "ios") {
            //             const customerSub = await Purchases.getProducts(currentSubscription)
            //             setCurrentSubscription(customerSub)
            //         }
            //         return customerSub;
            //     } catch (error) {
            //         console.error("Error fetching currentSubscription:", error);
            //     }
            //
            // } else {
            //     setCurrentSubscription(false)
            //     return false;
            // }
        } catch (error) {
            console.error("Error checking subscription status:", error);
        }
    };

    return (
        <RevenueCatContext.Provider
            value={{
                isSubscribed,
                getOfferings,
                offerings,
                getProducts,
                products,
                currentSubscription,
                getCurrentSubscription,
                checkUserSubscriptionStatus,
                isInFreeTrial
            }}
        >
            {children}
        </RevenueCatContext.Provider>
    );
}

export function useRevenueCatContext() {
    return useContext(RevenueCatContext);
}
