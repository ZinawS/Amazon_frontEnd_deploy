import axios from "axios";

// Better configuration with error handling
export const axiosInstance = axios.create({
  // baseURL: "http://localhost:5001/clone-69546/us-central1/api",
  // Base url at Firebase
  baseURL: "https://api-yfpe3h5jza-uc.a.run.app",
  // Base URL at render 
  // baseURL: "https://amazon-api-deploy-2-utew.onrender.com/",
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

// Add request interceptor for error handling
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Sending request to:", config.url);
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Received response:", response.status);
    return response;
  },
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    return Promise.reject(error);
  }
);
