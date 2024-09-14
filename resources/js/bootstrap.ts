import axios from "axios";
import { router } from "@inertiajs/react";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.common["Content-Type"] = "application/json";

axios.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        if (response.status === 204) {
            location.replace(location.href);
        }
        return response;
    },
);

router.on("invalid", (event) => {
    // event.preventDefault();
});
