// WebSocketContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import {authStorage} from "../../MMKV/auth";
import {Linking} from "react-native";
import {GetReward} from "../../axios/axiosCustomer/reward";
import {controlStorage} from "../../MMKV/control";
import {saveCurrentCollectorMMKV} from "../../MMKV/mmkvCustomer/collectors";
import {router} from "expo-router";
import {saveCurrentVoucherMMKV} from "../../MMKV/mmkvCustomer/vouchers";

const DeepLinkingContext = createContext(null);

export function DeepLinkingProvider({children}) {
    const [linkParameters, setLinkParameters] = useState(null);

    const accessToken = authStorage.getString("accessToken");
    const customerIsLogedIn = controlStorage.getBoolean("customerIsLogedIn");

    useEffect(() => {
        const initDeepLinkingHandler = async () => {
            await handleLinkParameter(linkParameters)
        }
        if (linkParameters && customerIsLogedIn) {
            initDeepLinkingHandler()
        }
    }, [linkParameters, customerIsLogedIn])

    useEffect(() => {

        console.log("Deep linking service initialized")
        // Handle the initial URL when the app is opened
        const handleInitialURL = (url) => {
            if (url) {
                const extractedLinkParameters = extractDataFromURL(url);
                setTimeout(() => {
                    setLinkParameters(extractedLinkParameters)
                }, 1000)
            }
        };

        // Handle the URL when the app is already open
        const handleDeepLink = (event) => {
            const url = event.url
            const extractedLinkParameters = extractDataFromURL(url);
            setTimeout(() => {
                setLinkParameters(extractedLinkParameters)
            }, 1000)
        };

        // Add event listener for deep links
        const subscription = Linking.addEventListener('url', handleDeepLink);

        // Get the initial URL if the app was opened from a deep link
        Linking.getInitialURL().then((url) => {
            handleInitialURL(url);
        });

        // Clean up the event listener on component unmount
        return () => {
            subscription.remove();
        };
    }, []);

    const extractDataFromURL = (url) => {
        // For example, you can use URLSearchParams to parse query parameters
        const params = new URLSearchParams(url.split('?')[1]);
        return Object.fromEntries(params.entries());
    };

    const handleLinkParameter = async (linkParameters) => {
        if (linkParameters.hasOwnProperty('code')) {
            console.log("deep link is " + linkParameters.code);
            await getReward(linkParameters.code);
        } else {
            console.log(`Sorry, no link parameter found for `);
        }
    }

    const getReward = async (campaignToken) => {
        try {
            const response = await GetReward(accessToken, campaignToken);
            setLinkParameters(null)
            if (response.type === "collector") {
                console.log(response.collector)
                saveCurrentCollectorMMKV(response.collector);
                router.push("homeCustomer/cardsView/collector")
            }
            if (response.type === "voucher") {
                console.log(response.voucher)
                saveCurrentVoucherMMKV(response.voucher);
                router.push("homeCustomer/cardsView/voucher")
            }
        } catch (error) {
            console.log(error);
        }
    }

    // linkParameters API
    const getLinkParameters = () => {
        return linkParameters
    };

    return (
        <DeepLinkingContext.Provider value={getLinkParameters}>
            {children}
        </DeepLinkingContext.Provider>
    );
}

export function useWebSocketContext() {
    return useContext(DeepLinkingContext);
}