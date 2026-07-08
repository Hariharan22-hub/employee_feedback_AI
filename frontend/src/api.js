import axios from "axios";

// Check if running on localhost or loopback to support development environment.
// In production, we use a relative path `/api` to communicate with the same origin.
const isLocalhost = Boolean(
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "[::1]" ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

const baseURL = import.meta.env.VITE_API_URL || (isLocalhost ? "http://127.0.0.1:8000/api" : "/api");

const api = axios.create({
    baseURL: baseURL,
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

});

export default api;