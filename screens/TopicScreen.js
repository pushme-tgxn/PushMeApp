import React, { useState, useEffect, useContext, useCallback } from "react";
import { SafeAreaView, FlatList, Text, useColorScheme, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { Screen } from "@react-navigation/native";

import { FAB } from "react-native-paper";

// import { FontAwesome5 } from "@expo/vector-icons";

import { AppReducer } from "../const";

import { Separator, CustomButton } from "../components/Shared";

import { setTopicList } from "../reducers/app";

import ViewTopic from "../components/ViewTopic";
import CustomNavigationBar from "../components/CustomNavigationBar";

import apiService from "../service/api";

import styles from "../styles";

const Stack = createStackNavigator();
const TopicScreen = () => {
    return (
        <Stack.Navigator
            initialRouteName="TopicList"
            screenOptions={{
                header: CustomNavigationBar,
            }}
        >
            <Stack.Screen name="TopicList" component={TopicList} options={{ headerShown: false }} />

            <Stack.Screen name="ViewTopic" component={ViewTopic} />
        </Stack.Navigator>
    );
};

const TopicList = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const themedStyles = styles(colorScheme);

    const { state, dispatch } = useContext(AppReducer);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        async function prepare() {
            setRefreshing(true);
            dispatch(setTopicList([]));

            try {
                const response = await apiService.topic.getList();

                dispatch(setTopicList(response.topics));
            } catch (error) {
                alert(error);
                console.error(error);
            } finally {
                setRefreshing(false);
            }
        }
        prepare();
    }, []);

    useEffect(onRefresh, []);

    const createTopic = async () => {
        await apiService.topic.create();
        onRefresh();
    };

    let topicList = [].concat(state.topicList);
    topicList.reverse();

    return (
        <SafeAreaView style={themedStyles.screenContainer}>
            <FlatList
                ListHeaderComponent={() => (
                    <Text style={themedStyles.headerText}>
                        {refreshing ? "List Loading..." : topicList.length == 0 ? "No Topics!" : "Topic List"}
                    </Text>
                )}
                data={topicList}
                onRefresh={onRefresh}
                refreshing={refreshing}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                    return (
                        <CustomButton
                            onPress={async () => {
                                navigation.navigate("ViewTopic", { topicData: item, topicIndex: index });
                            }}
                            style={themedStyles.listItem}
                        >
                            {item.createdAt} (ID: {item.id})
                        </CustomButton>
                    );
                }}
            />
            <FAB style={fabStyles.fab} icon="plus" onPress={createTopic} />
        </SafeAreaView>
    );
};

const fabStyles = StyleSheet.create({
    fab: {
        position: "absolute",
        backgroundColor: "#a845ff",
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default TopicScreen;
