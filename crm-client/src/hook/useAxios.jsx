import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const useAxios = () => {
    const axiosPublic = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });
    return axiosPublic;
};

export default useAxios;