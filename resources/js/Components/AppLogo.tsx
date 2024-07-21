import { cn } from "@/Utils/utils";

export default function AppLogo({ className = "" }) {
    return (
        <img
            className={cn("w-52", className)}
            src="/assets/logo.png"
            alt="logo"
        />
    );
}
