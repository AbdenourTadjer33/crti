import axios from "axios";
import { router } from "@inertiajs/react";
import dayjs from "dayjs";
import fr from "dayjs/locale/fr";
import localData from "dayjs/plugin/localeData";
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.locale(fr);
dayjs.extend(objectSupport);
dayjs.extend(relativeTime);
dayjs.extend(localData);
dayjs.extend(utc);
dayjs.extend(timezone);


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
