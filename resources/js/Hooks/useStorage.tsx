import { useState } from "react";

export default function useStorage<T>(
    key: string,
    initialValue?: T
): [T | null, (value: T) => void] {
    const [storedValue, setStoredValue] = useState<T | null>(() => {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue ?? null;
    });

    const setValue = (value: T) => {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
    };

    return [storedValue, setValue];
}
