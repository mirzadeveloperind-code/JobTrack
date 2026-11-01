import axios from "axios";

const API_URL = "http://localhost:5000/api/applications";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get all applications
export const getApplications = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

// Create application
export const createApplication = async (applicationData) => {
  const response = await axios.post(
    API_URL,
    applicationData,
    getAuthConfig()
  );
  return response.data;
};

// Keep addApplication available for older imports
export const addApplication = createApplication;

// Update application
export const updateApplication = async (id, applicationData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    applicationData,
    getAuthConfig()
  );
  return response.data;
};

// Delete application
export const deleteApplication = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );
  return response.data;
};