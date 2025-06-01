// src/Api/axios.js (or apiClient.js)
import axios from "axios";
import { auth } from "../Utility/firebase"; // Import from your firebase config
import { getIdToken } from "firebase/auth";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://us-central1-clone-69546.cloudfunctions.net/api",
  // "http://localhost:3000/clone-69546/us-central1/api",
  timeout: 10000,
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(async (config) => {
  // Skip auth for these endpoints
  const publicEndpoints = ["/health"];
  if (publicEndpoints.some((ep) => config.url.includes(ep))) {
    return config;
  }

  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No authenticated user");

    const token = await getIdToken(user);
    config.headers.Authorization = `Bearer ${token}`;
  } catch (error) {
    console.error("Failed to attach auth token:", error);
    throw error; // This will trigger the error in your component
  }

  return config;
});

export default apiClient;
