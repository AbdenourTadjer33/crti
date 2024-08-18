import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        react(),
        laravel({
            input: ["resources/js/app.tsx", "resources/css/app.css", "resources/js/welcome.js"],
            refresh: true,
        }),
    ],
});
