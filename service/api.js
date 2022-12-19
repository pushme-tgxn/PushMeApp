import { showToast } from "../components/Shared";

import APIService from "@pushme-tgxn/pushmesdk";

const apiService = new APIService({
    logging: (message, ...args) => {
        console.log(message, ...args);
        showToast(message);
    },
});
export default apiService;
