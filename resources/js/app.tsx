import "./bootstrap";
import "../css/app.css";

import React from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { capitalize } from "./Utils/helper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ziggy } from "./ziggy";
import { route } from "ziggy-js";
import AuthLayout from "./Layouts/AuthLayout";

globalThis.Ziggy = Ziggy;
globalThis.route = route;

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${capitalize(appName)}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={new QueryClient()}>
                <App {...props} />
            </QueryClientProvider>
        );
    },
    progress: {
        color: "#4F46E5",
        showSpinner: true,
    },
}).then(() => document.getElementById("app")?.removeAttribute("data-page"));
