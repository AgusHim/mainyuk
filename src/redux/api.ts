import { decryptData, encryptData } from "@/utils/crypto";
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: `${process.env.BASE_API}/api`, // Set your API base URL
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
    if(response.data.access_token != null){
      var result = encryptData(response.data.access_token);
      localStorage.setItem("access_token",result);
    }
    return response;
  },
  (error) => {
    let message;

    if (error.response) {
      if (error.response.status === 500) message = "Internal server error";
      
      else message = error.response.data.error;

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

export default api;
