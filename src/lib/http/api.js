import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const apiMultipart = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" },
});

const handleError = (error, message) => {
  if (axios.isAxiosError(error) && error.response?.data?.error) {
    throw new Error(error.response.data.error);
  }
  throw new Error(message);
};

export const signupUser = async (userData) => {
  try {
    const { data } = await api.post("/auth/signup", userData);
    return data;
  } catch (error) {
    handleError(error, "Failed to register user");
  }
};

export const loginUser = async (userData) => {
  try {
    const { data } = await api.post("/auth/login", userData);
    return data;
  } catch (error) {
    handleError(error, "Failed to login");
  }
};

export const logoutUser = async () => {
  try {
    await api.get("/auth/logout");
  } catch (error) {
    handleError(error, "Failed to logout");
  }
};

export const getUser = async () => {
  try {
    const { data } = await api.get("/user/me");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch user");
  }
};

export const fetchAllJobs = async () => {
  try {
    const { data } = await api.get("/jobs");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch jobs");
  }
};

export const createJob = async (jobData) => {
  try {
    const { data } = await api.post("/jobs", jobData);
    return data;
  } catch (error) {
    handleError(error, "Failed to create job");
  }
};

export const fetchMyJobs = async () => {
  try {
    const { data } = await api.get("/jobs/my");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch jobs");
  }
};

export const fetchJobById = async (jobId) => {
  try {
    const { data } = await api.get(`/jobs/${jobId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch job");
  }
};

export const applyForJob = async (formData) => {
  try {
    const { data } = await apiMultipart.post("/jobs/apply", formData);
    return data;
  } catch (error) {
    handleError(error, "Failed to apply for job");
  }
};

export const fetchJobApplications = async () => {
  try {
    const { data } = await api.get("/applications");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch applied jobs");
  }
};

export const updateApplicationStatus = async (appId, action, payload = {}) => {
  try {
    const { data } = await api.patch(`/applications/${appId}`, {
      action,
      ...payload,
    });
    return data;
  } catch (error) {
    handleError(error, "Failed to update application");
  }
};

export const generateInterviewQuestionsByGemini = async (jobData) => {
  try {
    const { data } = await api.post("/gemini", jobData);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate questions");
  }
};

export const generateFeedback = async (interviewData) => {
  try {
    const { data } = await api.post("/gemini/generateFeedback", interviewData);
    return data;
  } catch (error) {
    handleError(error, "Failed to generate feedback");
  }
};

export const assignedInterview = async () => {
  try {
    const { data } = await api.get("/interviews/assigned");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch assigned interviews");
  }
};

export const fetchInterviewQuestions = async (interviewId) => {
  try {
    const { data } = await api.get(`/interviews/${interviewId}/questions`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch interview questions");
  }
};

export const submitInterview = async (payload) => {
  try {
    const { data } = await api.post("/interviews/submit", payload);
    return data;
  } catch (error) {
    handleError(error, "Failed to submit interview");
  }
};

export const fetchJobAndApplications = async (jobId) => {
  try {
    const { data } = await api.get(`/applications/job/${jobId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch job and applications");
  }
};

export const createMockTest = async (payload) => {
  try {
    const { data } = await api.post("/mock-test", payload);
    return data;
  } catch (error) {
    handleError(error, "Failed to create mock test");
  }
};

export const fetchMockTests = async () => {
  try {
    const { data } = await api.get("/mock-test");
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch mock tests");
  }
};

export const fetchMockTestById = async (mockId) => {
  try {
    const { data } = await api.get(`/mock-test/${mockId}`);
    return data;
  } catch (error) {
    handleError(error, "Failed to fetch mock test details");
  }
};

export default api;
