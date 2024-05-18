import AppLogo from "@/Components/AppLogo";
import { FormWrapper } from "@/Components/ui/form";
import React, { useEffect } from "react";

export default function ({ ...props }: React.PropsWithChildren) {
    useEffect(() => {
        if (document.documentElement.classList.contains("dark")) {
            document.documentElement.classList.remove("dark");
        }
    }, []);
    return (
        <div className="flex flex-col items-center justify-center px-4 py-8 mx-auto h-screen lg:py-0">
            <a
                href="/"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
            >
                <AppLogo />
            </a>
            <div className="w-full sm:max-w-xl" {...props} />
        </div>
    );
}
