import axios from "axios";

window.onload = function () {
    document
        .getElementById("goto-authentication-form")
        .addEventListener("click", () => {
            const targetSection = document.getElementById("auth-form");
            const targetInput = targetSection.querySelector(
                "input[name=username]"
            );

            // Smooth scroll to the section
            targetSection.scrollIntoView({
                behavior: "smooth",
            });

            // Create an intersection observer to check when the input becomes fully visible
            const observer = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach((entry) => {
                        // Check if the element is fully visible (threshold 1 means 100% visible)
                        if (entry.intersectionRatio === 1) {
                            // Focus the input when it's fully visible
                            setTimeout(() => targetInput.focus(), 50);
                            // Stop observing once the input is focused
                            observer.disconnect();
                        }
                    });
                },
                {
                    root: null, // This observes the viewport
                    threshold: 1.0, // 1.0 means 100% of the target is visible
                }
            );

            // Start observing the input field
            observer.observe(targetInput);
        });

    const form = document.getElementById("auth-form");

    const usernameEl = form.querySelector("input[name=username]");
    const usernameErrorEl = form.querySelector("#username-error");
    const ENDPOINT = "/check-user";

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
