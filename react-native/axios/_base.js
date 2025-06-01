import axios from "axios";

const BASE_URL = __DEV__ ? "http://192.168.178.64:8000/backend/api" : "https://ugem.app/backend/api";

const AxiosBase = axios.create({
    baseURL: BASE_URL,
});

export default AxiosBase;

if (__DEV__) {
    console.log('I am in debug', BASE_URL);
}
