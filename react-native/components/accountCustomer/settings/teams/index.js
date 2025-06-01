import React, {useEffect, useState} from "react";
import {View, TextInput, Text, TouchableOpacity} from "react-native";
import {GestureHandlerRootView, PanGestureHandler, ScrollView} from "react-native-gesture-handler";

import * as Haptics from "expo-haptics";
import {GetTeamsRequests, InviteTeamMember, UpdateRequestStatus} from "../../../../axios/axiosTeams/teams";
import {authStorage} from "../../../../MMKV/auth";
import {saveTeamRequestsMMKV} from "../../../../MMKV/mmkvTeams";
import IncomingRequestsSection from "./incomingRequests";
import SentRequestsSection from "./sentRequests";
import TeamMembersSection from "./teamMembers";
import AcceptedRequestSection from "./acceptedRequests";
import {validateEmail} from "../../../../utils/auth";
import {router} from "expo-router";

const Teams = ({setIsTeams}) => {
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
                console.log(email, accessToken);
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
                <TouchableOpacity activeOpacity={0.99}>
                    <View
                        className="pl-4 h-26 pt-8 items-center flex-row justify-between bg-ship-gray-50 border-b border-b-ship-gray-200">
                        <Text className="text-3xl font-bold text-normaltext">Manage teams</Text>
                        <TouchableOpacity className="mr-6 items-center justify-center h-16 pt-4"
                                          onPress={() => router.back()}>
                            <Text className="text-lg pb-3 text-normaltext">Done</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView className="h-screen w-screen bg-white">
                        <View className="w-full flex-1 items-center">
                            <View className="mt-4 mx-4 max-w-[600]">
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
                </TouchableOpacity>
                {/*</PanGestureHandler>*/}
            </View>
        </>
    );
};

export default Teams;
