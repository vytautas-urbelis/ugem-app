import React, {useEffect, useState} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {ScrollView, TextInput} from "react-native-gesture-handler";

import * as Haptics from "expo-haptics";
import {GetTeamsRequests, InviteTeamMember, UpdateRequestStatus} from "../../../../axios/axiosTeams/teams";
import {authStorage} from "../../../../MMKV/auth";
import IncomingRequestsSection from "./incomingRequests";
import SentRequestsSection from "./sentRequests";
import TeamMembersSection from "./teamMembers";
import AcceptedRequestSection from "./acceptedRequests";
import {validateEmail} from "../../../../utils/auth";
import {colors} from "../../../../constants/colors";
import {router} from "expo-router";

const Teams = () => {
    const [value, setValue] = useState(50);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [anError, setAnError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [teamsRequests, setTeamsRequests] = useState(null);

    const accessToken = authStorage.getString("accessToken");

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const requests = await GetTeamsRequests(accessToken);
                setTeamsRequests(requests);
                setLoading(false);
            } catch (error) {
                console.log(error);
                alert("There are connection problems.");
            } finally {
            }
        };
        fetchData();
    }, []);

    const onRefresh = async () => {
        const requests = await GetTeamsRequests(accessToken);
        setTeamsRequests(requests);
    };

    const HandleRequestEvent = async (status, request_id) => {
        try {
            await UpdateRequestStatus(accessToken, status, request_id);
            onRefresh();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error) {
            console.log(error);
        }
    };

    const InviteMember = async () => {
        if (validateEmail(email, setAnError)) {
            try {
                console.log(email, accessToken)
                await InviteTeamMember(accessToken, email);
                // setTeamsRequests(requests);
                onRefresh();
                setAnError(null);
                setMessage("Invitation sent successfully.");
                setEmail("");
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                setMessage(null);
                setAnError(error.response.data);
            }
        }
    };

    // const onGestureEvent = (event) => {
    //     const {translationX} = event.nativeEvent;
    //     if (translationX > value) {
    //         setIsTeams(false);
    //         setValue(400);
    //         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    //     }
    // };
    return (
        <>
            <View className="w-full flex-1 justify-center items-center">
                <View
                    className="w-screen pl-4 h-26 pt-8 items-center flex-row justify-between bg-ship-gray-50 border-b border-b-ship-gray-200">
                    <Text className="text-3xl font-bold text-normaltext">Manage teams</Text>
                    <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                      onPress={() => router.back()}>
                        <Text className="text-lg pb-3 text-normaltext">Done</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView keyboardShouldPersistTaps="handled" className="h-screen w-screen bg-white">
                    <View className="w-full flex-1">
                        <View className="mt-4 mx-4">
                            <View className="w-full">

                                <View className="mb-4 w-full mt-4">

                                    <TextInput
                                        style={{borderColor: colors["ship-gray"]["200"]}}
                                        autoCapitalize='none'
                                        inputMode={"email"}
                                        className="text-xl border p-5 border-ship-gray-300 rounded-lg bg-white flex-grow"
                                        onChangeText={(text) => setEmail(text)}
                                        value={email}
                                    />
                                    <Text
                                        className=" text-ship-gray-700  text-left text-xl mb-1 bg-white px-2 top-[-12] left-5 absolute">Invite
                                        member
                                    </Text>
                                </View>
                                {/* </View> */}
                                <View className="w-full justify-between items-start">
                                    <View className="w-full mb-3">
                                        {!message & !anError && <View></View>}
                                        {message ?
                                            <Text className="text-green-500 text-lg">{message}</Text> : <></>}
                                        {anError ?
                                            <Text className="text-red-500 text-lg">{anError}</Text> : <></>}
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            InviteMember()
                                        }}
                                        className="w-full rounded-lg bg-ship-gray-900 items-center justify-center">

                                        <Text
                                            className="text-center w-full p-5 text-white font-semibold text-xl">Invite</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                            {!teamsRequests ? (
                                <></>
                            ) : (
                                <>
                                    <View>
                                        <TeamMembersSection teamMembers={teamsRequests.my_team_members}
                                                            HandleRequestEvent={HandleRequestEvent}/>
                                    </View>
                                    <View>
                                        <AcceptedRequestSection sentRequests={teamsRequests.my_teams}
                                                                HandleRequestEvent={HandleRequestEvent}/>
                                    </View>
                                    <View>
                                        <SentRequestsSection sentRequests={teamsRequests.outgoing}
                                                             HandleRequestEvent={HandleRequestEvent}/>
                                    </View>
                                    <View>
                                        <IncomingRequestsSection incominRequests={teamsRequests.incoming}
                                                                 HandleRequestEvent={HandleRequestEvent}/>
                                    </View>
                                </>
                            )}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

export default Teams;