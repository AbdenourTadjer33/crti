import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";
import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./resources/**/*.{blade.php,js,jsx,ts,tsx}"],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
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
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [
        forms,
        tailwindcssAnimate,
        function ({ addUtilities }) {
            addUtilities(
                {
                    ".custom-scrollbar::-webkit-scrollbar": {
                        width: "6px",
                        height: "2px",
                    },

                    ".custom-scrollbar::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        height: "2px",
                    },
                    ".custom-scrollbar::-webkit-scrollbar-thumb": {
                        backgroundColor: "#888",
                        borderRadius: "6px",
                        border: "3px solid #f1f1f1",
                        height: "2px",
                    },
                    ".custom-scrollbar::-webkit-scrollbar-thumb:hover": {
                        background: "#555",
                    },
                },
                ["responsive"]
            );
         }
    ],
    darkMode: "class",
};
