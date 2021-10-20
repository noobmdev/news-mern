import axios from "axios";

const defaultOptions = {
  baseURL: "http://localhost:5000/api/v1",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

// Create instance
let axiosInstance = axios.create(defaultOptions);

// Set the AUTH token for any request
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export { axiosInstance };
