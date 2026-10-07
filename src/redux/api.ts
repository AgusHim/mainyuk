import { decryptData, encryptData } from "@/utils/crypto";
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";

// Dynamically determine the host value based on the environment variable
const baseURL = (role: string) => {
  const baseAPI = process.env.BASE_API;
  if (baseAPI?.includes("localhost")) {
    return `http://${baseAPI}/${rolePath(role)}`;
  } else {
    return `https://${baseAPI}/${rolePath(role)}`;
  }
};

const rolePath = (role: string) => {
  let rolePath = "api";
  if (role == "admin" || role == "pj") {
    rolePath = "admin_api";
  }
  if (role == "ranger") {
    rolePath = "ranger_api";
  }
  if (role == "user") {
    rolePath = "user_api";
  }
  return rolePath;
};

// Shared interceptors
const attachInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      let sessionAuth = localStorage.getItem("access_token");
      if (sessionAuth != null) {
        const token = decryptData(sessionAuth);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (response.data.access_token != null) {
        var result = encryptData(response.data.access_token);
        localStorage.setItem("access_token", result);
      }
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          if (typeof window !== "undefined" && window.location.pathname !== "/signin") {
            window.location.href = "/signin";
          }
        }

        const message = error.response.data.error;
        if (typeof message === "string") {
          toast.error(message);
        }
      }

      return Promise.reject(error);
    }
  );
};

// Create an axios instance with the dynamically determined baseURL
const api = axios.create({
  baseURL: `${baseURL("jamaah")}`, // Use the dynamically determined host
});

const user_api = axios.create({
  baseURL: `${baseURL("user")}`, // Use the dynamically determined host
});

const admin_api = axios.create({
  baseURL: `${baseURL("admin")}`, // Use the dynamically determined host
});

const ranger_api = axios.create({
  baseURL: `${baseURL("ranger")}`, // Use the dynamically determined host
});

attachInterceptors(api);
attachInterceptors(user_api);
attachInterceptors(admin_api);
attachInterceptors(ranger_api);

export { api, user_api, admin_api, ranger_api };
