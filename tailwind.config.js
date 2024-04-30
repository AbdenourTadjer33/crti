import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.{blade.php,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#edf0ff",
                    100: "#dfe3ff",
                    200: "#c5ccff",
                    300: "#a2aaff",
                    400: "#7d7efc",
                    500: "#655bf5",
                    600: "#5a41ea",
                    700: "#4c34ce",
                    800: "#3e2da6",
                    900: "#362c83",
                    950: "#211a4c",
                },
            },
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    plugins: [forms],
    darkMode: "class",
};
