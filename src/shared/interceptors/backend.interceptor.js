import axios from 'axios';
import environment from '../../config.js';

export let backendInterceptor = axios;

backendInterceptor.defaults.baseURL = environment.backendUrl;

backendInterceptor.interceptors.request.use((config) => {
    //TODO: configure token renewal if necessary, find way to store token
    //config.headers.Autorization = `Bearer ${token}`;
    console.log("request: ", config.url);
    if (config.data) console.log(config.data);
    else console.log("request data is empty");
    return config;
});

backendInterceptor.interceptors.response.use(
    (response) => {
        console.log("response for ", response.config.url, ": ", response);
        return response;    
    },
    (error) => {
        console.log(error);
        alert(error);
    });