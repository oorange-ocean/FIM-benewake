import axios from "axios";
// const baseURL = import.meta.env.VITE_BASE_URL;
let baseURL = import.meta.env.VITE_BASE_URL === 'https://fim.benewake.com/benewake' ? 'https://fim.benewake.com/benewake' : 'https://www.fim.benewake.top/benewake/';
const api = axios.create({
    baseURL,
    withCredentials: true
});
api.defaults.withCredentials = true;

export default api