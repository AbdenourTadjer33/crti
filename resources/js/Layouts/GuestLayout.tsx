import React, { useEffect } from "react";
import AppLogo from "@/Components/common/app-logo";

export default function ({ ...props }: React.PropsWithChildren) {
    useEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
        }
    }, []);
    return (
        <div className="flex flex-col items-center justify-center md:px-4 px-2 py-8 mx-auto h-screen lg:py-0">
            <a
                href="/"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
                <AppLogo className="md:w-52 w-32" />
            </a>
            <div className="w-full sm:max-w-xl" {...props} />
        </div>
    );
}
