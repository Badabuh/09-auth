import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});
