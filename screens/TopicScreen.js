import React, { useState, useEffect, useContext, useCallback } from "react";

import { SafeAreaView, View, FlatList, useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import { Text, Button, FAB } from "react-native-paper";

import { AppReducer } from "../const";
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

    // reverse topic list @TODO do server-side (request `order param)
    let topicList = [].concat(state.topicList);
    topicList.reverse();

    return (
        <SafeAreaView style={[themedStyles.container.base]}>
            <View>
                <FlatList
                    ListHeaderComponent={() => (
                        <Text variant="displaySmall" style={{ marginBottom: 10 }}>
                            {refreshing
                                ? "List Loading..."
                                : topicList.length == 0
                                ? "No Topics!"
                                : "Topic List"}
                        </Text>
                    )}
                    data={topicList}
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => {
                        return (
                            <Button
                                style={[themedStyles.button.bigButton, themedStyles.button.listButton]}
                                onPress={async () => {
                                    navigation.navigate("ViewTopic", { topicData: item, topicIndex: index });
                                }}
                                mode="contained-tonal"
                            >
                                {item.createdAt} (ID: {item.id})
                            </Button>
                        );
                    }}
                />
            </View>
            <FAB style={themedStyles.fab} icon="plus" onPress={createTopic} />
        </SafeAreaView>
    );
};

export default TopicScreen;
