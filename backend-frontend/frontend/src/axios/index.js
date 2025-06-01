import axios from "axios"

const BASE_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8000/backend/api"
        : window.location.hostname === "www.staging-develop.ugem.app" ? "https://staging-develop.ugem.app/backend/api"
            : window.location.hostname === "staging-develop.ugem.app" ? "https://staging-develop.ugem.app/backend/api"
                : "https://ugem.app/backend/api"

const AxiosMotion = axios.create({
    baseURL: BASE_URL
})

export default AxiosMotion
