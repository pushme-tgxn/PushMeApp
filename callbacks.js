import { setTopicList } from "./reducers/app";

import apiService from "./service/api";

export async function reloadTopicList(dispatch) {
    dispatch(setTopicList([]));

    try {
        const response = await apiService.topic.getList();
        dispatch(setTopicList(response.topics));
    } catch (error) {
        alert(error);
        console.error(error);
    }
}
