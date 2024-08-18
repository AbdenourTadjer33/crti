import axios from "axios";

window.onload = function () {
    const form = document.getElementById("auth-form");
    if (!form) {
        return;
    }

    const usernameEl = form.querySelector("input[name=username]");
    const usernameErrorEl = form.querySelector("#username-error");
    const ENDPOINT = "/api/v1/auth/check-user";

    form.onsubmit = async function (e) {
        e.preventDefault();

        const username = usernameEl?.value;

        const LOGIN_ROUTE = `/login?username=${username}`;
        const SIGNUP_ROUTE = `/register?username=${username}`;

        try {
            await axios.post(ENDPOINT, { username });
            return location.replace(LOGIN_ROUTE);
        } catch (error) {
            const { status, data } = error.response;

            if (status === 422) {
                usernameErrorEl.classList.remove("hidden");
                usernameErrorEl.innerText = data?.message;
                return;
            }

            if (status === 404) {
                return location.replace(SIGNUP_ROUTE);
            }
        }
    };
};
