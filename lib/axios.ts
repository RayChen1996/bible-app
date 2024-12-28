import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://bible-api.com",
  headers: {
    "Content-Type": "application/json",
  },
});
