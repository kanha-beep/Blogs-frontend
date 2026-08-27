"use client";

import axios from "axios"

let unauthorizedHandler = null;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "/api"
})

api.interceptors.request.use((config) => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;

    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const shouldHandle =
            error?.response?.status === 401 &&
            !error?.config?.skipAuthRedirect &&
            typeof unauthorizedHandler === "function";

        if (shouldHandle) {
            unauthorizedHandler(error);
        }

        return Promise.reject(error);
    }
);

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

export default api;
