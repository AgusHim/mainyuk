import { decryptData, encryptData } from "@/utils/crypto";
import axios from "axios";
import { toast } from "react-toastify";

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
  return rolePath;
};

// Create an axios instance with the dynamically determined baseURL
const api = axios.create({
  baseURL: `${baseURL("jamaah")}`, // Use the dynamically determined host
});

const admin_api = axios.create({
  baseURL: `${baseURL("admin")}`, // Use the dynamically determined host
});

const ranger_api = axios.create({
  baseURL: `${baseURL("ranger")}`, // Use the dynamically determined host
});

api.interceptors.request.use(
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

api.interceptors.response.use(
  (response) => {
    if (response.data.access_token != null) {
      var result = encryptData(response.data.access_token);
      localStorage.setItem("access_token", result);
    }
    return response;
  },
  (error) => {
    let message;

    if (error.response) {
      message = error.response.data.error;
      if (typeof message === "string") {
        toast.error(message, {
          className: "toast",
        });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

admin_api.interceptors.request.use(
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

admin_api.interceptors.response.use(
  (response) => {
    if (response.data.access_token != null) {
      var result = encryptData(response.data.access_token);
      localStorage.setItem("access_token", result);
    }
    return response;
  },
  (error) => {
    let message;

    if (error.response) {
      message = error.response.data.error;
      if (typeof message === "string") {
        toast.error(message, {
          className: "toast",
        });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

ranger_api.interceptors.request.use(
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

ranger_api.interceptors.response.use(
  (response) => {
    if (response.data.access_token != null) {
      var result = encryptData(response.data.access_token);
      localStorage.setItem("access_token", result);
    }
    return response;
  },
  (error) => {
    let message;

    if (error.response) {
      message = error.response.data.error;
      if (typeof message === "string") {
        toast.error(message, {
          className: "toast",
        });
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export { api, admin_api, ranger_api };
