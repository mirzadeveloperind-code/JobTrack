
import axios from "axios";

const API_URL = "http://localhost:5000/api/profile";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Fetch user profile
export const getProfile = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  const response = await axios.put(
    API_URL,
    profileData,
    getAuthConfig()
  );

  return response.data;
};
