import {useEffect, useState} from "react";
import {Text, View} from "react-native";

import {useSharedValue} from "react-native-reanimated";
import {FollowBusiness, GetFeed, GetFeedSearch} from "../../../axios/axiosCustomer/business";
import {authStorage} from "../../../MMKV/auth";
import FeedMessage from "./message";
import FeedCampaign from "./campaign";
import FeedPromotion from "./promotion";
import FeedEvent from "./event";
import {Modal, SlideAnimation} from "react-native-modals";
import BusinessProfile from "../../businessProfile";

import * as Haptics from "expo-haptics";
import {useMMKVBoolean} from "react-native-mmkv";
import {controlStorage} from "../../../MMKV/control";
import {FlatList, Pressable, RefreshControl} from "react-native-gesture-handler";

const Feed = ({searchValue, debounce, setDebounce, setLoader, currentLocation, setLoaded}) => {
    const [feed, setFeed] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [isBusinessProfile, setIsBusinessProfile] = useState(false);
    const [businessId, setBusinessId] = useState(null);

    // MMKV booleans for modals
    const [refreshFeed, setRefreshFeed] = useMMKVBoolean("refreshFeed", controlStorage);

    const accessToken = authStorage.getString("accessToken");

    const scale = useSharedValue(0.9);
    const opacity = useSharedValue(0);

    const openBusinessProfile = (businessId) => {
        setBusinessId(businessId);
        setIsBusinessProfile(true);
    };

    const onRefresh = () => {
        setRefreshFeed(!refreshFeed)
    }


    useEffect(() => {
        setRefreshing(true);
        setLoader(true);
        setDebounce(500);

        // If customer search for businesses it will load businesses
        clearTimeout(timeoutId);

        const timeoutId = setTimeout(async () => {
            // if (searchValue) {
            // setFeed(null);
            try {
                if (searchValue) {
                    const feed = await GetFeedSearch(accessToken, searchValue, currentLocation.latitude, currentLocation.longitude);
                    setFeed(feed);
                } else if (!searchValue) {
                    const feed = await GetFeed(accessToken, currentLocation.latitude, currentLocation.longitude);
                    setFeed(feed);
                }
                // setFeed(feed);
            } catch (error) {
                alert("There is a connection problem!");
                console.log(error);
            } finally {
                setLoader(false);
                setRefreshing(false);
                setLoaded(true);
            }
            // }
        }, debounce);

        return () => clearTimeout(timeoutId);
    }, [searchValue, currentLocation, refreshFeed]);

    // Follow business on search
    const toggleFollow = async (businessId) => {
        try {
            const updatedFeed = feed.map((data) => {
                console.log(data.data.business_user_profile.user);
                if (data.data.business_user_profile.user.id === businessId) {
                    data.data.business_user_profile.user.following = true;
                    return data;
                } else {
                    return data;
                }
            });
            setFeed(updatedFeed);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            await FollowBusiness(businessId, accessToken);
        } catch (error) {
            const updatedFeed = feed.map((data) => {
                if (data.data.business_user_profile.user.id === businessId) {
                    return (data.data.business_user_profile.user.following = false);
                }
            });
            setFeed(updatedFeed);
            console.log(error);
        } finally {
        }
    };

    return (
        <>
            {feed && (
                <>
                    {feed.length === 0 &&
                        <View className="flex-row gap-4 w-full mb-6 p-4">
                            <View className="bg-ship-gray-50 rounded-lg border border-ship-gray-300 mb-4 w-full">
                                <View className={'p-3'}>
                                    <Text className={'text-base text-ship-gray-900 '}>
                                        There, you will find the activities of the businesses you follow.
                                    </Text>
                                </View>
                            </View>
                        </View>}
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        className="w-full h-full flex-1 p-4 pb-24"
                        data={feed} // Array of data to display
                        renderItem={({item, index}) => (
                            <Pressable className="">

                                {item.item_type === "message" && (
                                    <FeedMessage
                                        openBusinessProfile={openBusinessProfile}
                                        item={item}
                                        key={item.data.id + "message"}
                                        index={index}
                                        currentLocation={currentLocation}
                                        toggleFollow={toggleFollow}
                                    />
                                )}
                                {item.item_type === "campaign" && (
                                    <FeedCampaign
                                        openBusinessProfile={openBusinessProfile}
                                        item={item}
                                        key={item.data.id + "campaign"}
                                        index={index}
                                        currentLocation={currentLocation}
                                        toggleFollow={toggleFollow}
                                    />
                                )}
                                {item.item_type === "promotion" && (
                                    <FeedPromotion
                                        openBusinessProfile={openBusinessProfile}
                                        item={item}
                                        key={item.data.id + "promotion"}
                                        index={index}
                                        currentLocation={currentLocation}
                                        toggleFollow={toggleFollow}
                                    />
                                )}
                                {item.item_type === "event" && (
                                    <FeedEvent
                                        openBusinessProfile={openBusinessProfile}
                                        item={item}
                                        key={item.data.id + "event"}
                                        index={index}
                                        currentLocation={currentLocation}
                                        toggleFollow={toggleFollow}
                                    />
                                )}

                            </Pressable>
                        )}
                        keyExtractor={(item, index) => {
                            return index.toString();
                        }} // Unique key for each item
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} enabled={true}/>}
                    ></FlatList>


                    <Modal
                        key={"businessProfileFromCustomerFeed"}
                        style={{zIndex: 2}}
                        visible={isBusinessProfile}
                        modalAnimation={
                            new SlideAnimation({
                                slideFrom: "bottom",
                            })
                        }>
                        <BusinessProfile businessId={businessId} setIsBusinessProfile={setIsBusinessProfile}/>
                    </Modal>
                </>
            )}
        </>
    );
};

export default Feed;
