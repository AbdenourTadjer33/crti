import React from "react";
import { Input } from "../ui/input";
import { Command, Search } from "lucide-react";
import { useEventListener } from "@/Hooks/use-event-listener";

interface SearchInputProps {
    value?: string;
    onValueChange?: (value: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

const SearchInput: React.FC<SearchInputProps> = ({
    inputRef,
    value,
    onValueChange,
}) => {
    useEventListener("keydown", (e) => {
        if (e.code === "KeyK" && e.ctrlKey) {
            e.preventDefault();
            inputRef && inputRef.current && inputRef.current.focus();
        }
    });

    return (
        <div className="relative">
            <Input
                ref={inputRef}
                value={value}
                onChange={(e) => onValueChange && onValueChange(e.target.value)}
                placeholder="Rechercher..."
                className="pl-8 pr-10"
            />
            <div className="absolute top-1/2 -translate-y-1/2 ms-2">
                <Search className="shrink-0 h-5 w-5 opacity-50" />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-1 mr-2 inline-flex items-center gap-0.5 opacity-50">
                <Command className="shrink-0 h-5 w-5" /> k
            </div>
        </div>
    );
};

export default SearchInput;
