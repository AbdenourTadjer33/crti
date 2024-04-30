export const InputError = ({
    className = "",
    message,
}: {
    className?: string;
    message?: string;
}) => {
    if (!message) return;

    return <div className={`text-sm text-red-500 ${className}`}>{message}</div>;
};
