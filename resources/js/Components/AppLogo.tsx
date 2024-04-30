import logo from "@/Assets/logo.png";

export default function AppLogo({ className = "" }) {
    return <img className={`w-52 ${className}`} src={logo} alt="logo" />;
}
