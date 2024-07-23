import ReactDOMServer from "react-dom/server";
import { createInertiaApp } from "@inertiajs/react";
import createServer from "@inertiajs/react/server";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
            return pages[`./Pages/${name}.jsx`];
        },
        setup: ({ App, props }) => <App {...props} />,
    })
);