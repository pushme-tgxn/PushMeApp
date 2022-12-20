import { showToast } from "../components/Shared";

import { BACKEND_URL } from "../const";

import APIService from "@pushme-tgxn/pushmesdk";

function createApiService() {
    const apiService = new APIService({
        backendUrl: BACKEND_URL,
        // logging: (message) => {
        //     console.log(message);
        //     showToast(message);
        // },
    });
    console.log("createApiService", apiService.backendUrl);

    return apiService;
}

const apiService = createApiService();
export default apiService;
