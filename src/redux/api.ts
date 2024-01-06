import axios from "axios";

const api = axios.create({
    baseURL:`http://localhost:8000/api`, // Set your API base URL
  });
  
  api.interceptors.request.use(
    (config) => {
        const sessionAuth = localStorage.getItem("auth");
        console.log(`Interceptopr ${sessionAuth}`)
      if (sessionAuth) {
        const user = JSON.parse(sessionAuth);
        config.headers.Authorization = `Bearer ${user.auth_token}`;
      }
      console.log(`Config${config.baseURL}`)
      return config;
  
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    (response) => {
      console.log(`[RES]${response.config.url}`)
      return response;
    },
    (error) => {
      // Handle error responses
      return Promise.reject(error);
    }
  );
  
  export default api;