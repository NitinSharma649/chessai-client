import axios from "axios";

const { REACT_APP_BASE_URL } = process.env;

const Axios = axios.create({
    baseURL: REACT_APP_BASE_URL || "http://localhost:50000",
});

export default Axios;
