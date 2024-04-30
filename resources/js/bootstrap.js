import axios from "axios";
import { Ziggy } from "./ziggy";


axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Content-Type"] = "application/json";

window.axios = axios;
window.Ziggy = Ziggy;