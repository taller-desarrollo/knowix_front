import axios from 'axios';
import { environment } from '../../config.js';

export let backendInterceptor = axios;

backendInterceptor.defaults.baseURL = environment.backendUrl;

backendInterceptor.interceptors.request.use((config) => {
    //TODO: configure token renewal if necessary, find way to store token
    //config.headers.Autorization = `Bearer ${token}`;
    return config;
});

backendInterceptor.interceptors.response.use(
    (response) => {
        return response;
    },
    (response) => {
        console.log("response: ", response);    
    },
    (error) => {
        //TODO: create notification service and show error if necessary
    });