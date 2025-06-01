import "../global.css";
import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {Redirect, router, SplashScreen} from "expo-router";
import {useMMKVBoolean} from "react-native-mmkv";
import {Modal, SlideAnimation} from "react-native-modals";
import VerifyUser from "../components/login/verifyUser";
import Login from "../components/login/login";
import {getCustomerMMKV, saveCustomerMMKV, userStorage} from "../MMKV/mmkvCustomer/user";
import {controlStorage} from "../MMKV/control";
import {getBusinessMMKV, saveBusinessMMKV} from "../MMKV/mmkvBusiness/user";
import {
    AuthenticateCustomer,
    RefreshCustomer,
    SendVerificationEmail,
    VerifyCustomer,
} from "../axios/axiosCustomer/customerAuth";
import {AuthenticateBusiness, RefreshBusiness, VerifyBusiness} from "../axios/axiosBusiness/businessAuth";
import {validateEmail} from "../utils/auth";
import {authStorage} from "../MMKV/auth";
import {FadeAnimation} from "react-native-modals/src";
import ForgotPassword from "../components/login/forgotPassword";

// Main functional component for the home screen
export default function Home() {

    SplashScreen.hide()

    // Retrieve tokens from storage for user authentication
    const accessToken = authStorage.getString("accessToken");
    const refreshToken = authStorage.getString("refreshToken");

    // Retrieve customer and business user data from storage
    const customerUser = getCustomerMMKV() || null;
    const businessUser = getBusinessMMKV() || null;

    // Check if the user is logged in
    const customerIsLogedIn = controlStorage.getBoolean("customerIsLogedIn");
    const businessIsLogedIn = controlStorage.getBoolean("businessIsLogedIn");

    // State variables for managing modal visibility and user data
    // const [emailInputModal, setEmailInputModal] = useState(false);
    const [verifyUserModal, setVerifyUserModal] = useState(false);
    const [forgotPasswordUpModal, setForgotPasswordUpModal] = useState(false);
    const [isBusiness, setIsBusiness] = useMMKVBoolean("is_business_account", userStorage);
    const [isAddCampaign, setIsAddCampaign] = useMMKVBoolean("isAddCampaign", controlStorage);
    const [isAddPromotion, setIsAddPromotion] = useMMKVBoolean("isAddPromotion", controlStorage);
    const [isAccountSettings, setIsAccountSettings] = useMMKVBoolean("isAccountSettings", controlStorage);
    const [isEditProfile, setIsEditProfile] = useMMKVBoolean("isEditProfile", controlStorage);
    const [activeWebSockets, setActiveWebSockets] = useMMKVBoolean("activeWebSockets", controlStorage);
    const [isRevenueCatConfigured, setIsRevenueCatConfigured] = useMMKVBoolean('isRevenueCatConfigured', controlStorage);
    const [loginModal, setLoginModal] = useState(false);
    const [later, setLater] = useState(false);
    const [anError, setAnError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    // useEffect to check if the user exists and is verified
    useEffect(() => {
        setIsAddCampaign(false);
        setIsAddPromotion(false);
        setIsAccountSettings(false);
        setIsEditProfile(false);
        setActiveWebSockets(false);
        setIsRevenueCatConfigured(false)

        const checkIfUserExists = async () => {
            try {
                // Check if customer exists and is verified
                if (customerUser && !customerUser.customer_user_profile.is_verified) {
                    setEmail(customerUser.email);
                    setActiveWebSockets(true)
                    return setVerifyUserModal(true);
                }
                if (customerIsLogedIn && customerUser) {
                    // If logged in, verify the customer and navigate accordingly
                    try {
                        await VerifyCustomer(accessToken);
                        controlStorage.set("customerIsLogedIn", true);
                        setActiveWebSockets(true)
                        if (controlStorage.getBoolean("teamProfile")) {
                            return router.navigate("homeTeam");
                        }
                        return router.navigate("homeCustomer");
                    } catch (error) {
                        try {
                            const access = await RefreshCustomer(refreshToken);
                            authStorage.set("accessToken", access.access);
                            controlStorage.set("customerIsLogedIn", true);
                            setActiveWebSockets(true)
                            return router.navigate("homeCustomer");
                        } catch (error) {
                            resetCustomerData();
                            setActiveWebSockets(false)
                            setLoginModal(true);
                        }
                    }
                } else {
                    resetCustomerData();
                    // setEmailInputModal(true);
                    try {
                        if (businessUser && businessIsLogedIn) {
                            await VerifyBusiness(accessToken);
                            setIsBusiness(true);
                            controlStorage.set("businessIsLogedIn", true);
                            if (controlStorage.getBoolean("teamProfile")) {
                                return router.navigate("homeTeam");
                            }
                            return router.navigate("homeBusiness");
                        } else {
                            try {
                                const newAccessToken = await RefreshBusiness(refreshToken);
                                authStorage.set("accessToken", newAccessToken);
                                setIsBusiness(true);
                                controlStorage.set("businessIsLogedIn", true);
                                return router.navigate("homeBusiness");
                            } catch (error) {
                                resetBusinessData();
                                setLoginModal(true);
                            }
                        }
                    } catch {
                        resetCustomerData();
                        resetBusinessData();
                        setLoginModal(true);
                    }
                }
            } catch (error) {
                resetCustomerData();
                resetBusinessData();
                setLoginModal(true);
            }
        };


        checkIfUserExists();
    }, []);

    // Function to reset customer data in storage
    const resetCustomerData = () => {
        saveCustomerMMKV("");
        setActiveWebSockets(false)
        controlStorage.set("customerIsLogedIn", false);
    };

    // Function to reset business data in storage
    const resetBusinessData = () => {
        saveBusinessMMKV("");
        controlStorage.set("businessIsLogedIn", false);
        authStorage.set("accessToken", "");
        authStorage.set("refreshToken", "");
        setIsBusiness(false);
    };

    // Function to handle sending a verification email
    const handelVerifyUser = async () => {
        setLoader(true);
        try {
            await SendVerificationEmail(email);
        } catch (error) {
            alert("Something went wrong.");
        } finally {
            setLoader(false);
        }
    };

    // Function to handle user verification completion
    const handelIsVerified = () => {
        setVerifyUserModal(false);
        router.replace("homeCustomer");
    };

    // Function to handle customer login
    const handleLogin = async () => {
        setLoader(true);
        if (validateEmail(email, setAnError)) {
            try {
                const data = await AuthenticateCustomer(email, password);
                controlStorage.set("customerIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveCustomerMMKV(data.customer);
                setAnError("");
                setLoginModal(false);
                setActiveWebSockets(true)
                // setEmailInputModal(false);
                router.replace("homeCustomer");
            } catch (error) {
                setAnError("Email or password doesn't match any account.");
                console.log(error.message);
            } finally {
                setLoader(false);
            }
        }
        setLoader(false);
    };

    // Function to handle business login
    const handleBusinessLogin = async () => {
        setLoader(true);
        if (validateEmail(email, setAnError)) {
            try {
                const data = await AuthenticateBusiness(email, password);
                controlStorage.set("businessIsLogedIn", true);
                authStorage.set("accessToken", data.access);
                authStorage.set("refreshToken", data.refresh);
                saveBusinessMMKV(data.business);
                setAnError("");
                setLoginModal(false);
                // setBusinessLoginModal(false);
                // setEmailInputModal(false);
                router.navigate("homeBusiness");
            } catch (error) {
                setAnError("Email or password doesn't match any account.");
            } finally {
                setLoader(false);
            }
        }
        setLoader(false);
    };

    // JSX structure for rendering modals and UI components
    return (
        <>
            <View className="items-center justify-center flex-1">
                {/* If customer user exists, redirect them, otherwise show an image */}
                {customerUser && later ? <Redirect href="homeCustomer"/> : <View className=""></View>}
                {/* <Image source={SHOP} className="mb-10 w-48 h-80 mt-1 rounded-md opacity-100" alt="Campaign Logo" /> */}
            </View>

            {/* Modal for Email Input */}
            <Modal style={{zIndex: 2}} visible={loginModal}
                   modalAnimation={new FadeAnimation()}>
                <View className="h-screen w-screen flex-1">
                    <Login
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleLogin={handleLogin}
                        handleBusinessLogin={handleBusinessLogin}
                        // handleAccountCheck={handleAccountCheck}
                        loader={loader}
                        anError={anError}
                        // setBusinessLoginModal={setBusinessLoginModal}
                        setAnError={setAnError}
                        setLoginModal={setLoginModal}
                        setForgotPasswordUpModal={setForgotPasswordUpModal}
                    />
                </View>
            </Modal>
            <Modal style={{zIndex: 2}} visible={forgotPasswordUpModal}
                   modalAnimation={new FadeAnimation()}>
                <View className="h-screen w-screen flex-1">
                    <ForgotPassword setForgotPasswordUpModal={setForgotPasswordUpModal} setLoginModal={setLoginModal}/>
                </View>
            </Modal>

            {/* Modal for User Verification */}
            <Modal style={{zIndex: 2}} visible={verifyUserModal}
                   modalAnimation={new SlideAnimation({slideFrom: "bottom"})}>

                <VerifyUser
                    setLater={setLater}
                    email={email}
                    handelIsVerified={handelIsVerified}
                    handelVerifyUser={handelVerifyUser}
                    loader={loader}
                    anError={anError}
                    customerUser={customerUser}
                    setVerifyUserModal={setVerifyUserModal}
                />

            </Modal>

        </>
    );
}
