import React, {
    forwardRef,
    useRef,
    useEffect,
    useState,
    Fragment,
} from "react";
import { Combobox, Listbox, Transition } from "@headlessui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: "text" | "password";
    className?: string;
    isFocused?: boolean;
    disabled?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function (
    {
        type = "text",
        className = "",
        isFocused = false,
        disabled = false,
        ...props
    },
    ref
) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 ${className}`}
            ref={ref || inputRef}
            disabled={disabled}
        />
    );
});

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
    className = "",
    ...props
}) => {
    return (
        <input
            type="checkbox"
            className={
                "w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800 " +
                className
            }
            {...props}
        />
    );
};

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    className?: string;
}

export const InputLabel: React.FC<LabelProps> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <label
            className={
                "block text-sm font-medium text-primary-950 dark:text-primary-50 " +
                className
            }
            {...props}
        >
            {children}
        </label>
    );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
}

export const Select: React.FC<SelectProps> = ({
    className = "",
    children,
    ...props
}) => {
    return (
        <select
            className={`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};

interface ComboProps {
    data: (string | number)[];
    value: string | number;
    onChange: (value: string | number) => void;
}

export const Combo: React.FC<ComboProps> = ({ data, value, onChange }) => {
    const [query, setQuery] = useState<string>("");

    const filteredData =
        query === ""
            ? data
            : data.filter((item) =>
                  item
                      .toLocaleString()
                      .toLowerCase()
                      .includes(query.toLowerCase())
              );

    const handleSelectChange = (value: string | number) => onChange(value);

    return (
        <Combobox value={value} onChange={handleSelectChange}>
            <div className="relative w-full">
                <div className="relative w-full cursor-default overflow-hidden rounded-lg text-left">
                    <Combobox.Input
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <LuChevronsUpDown className="h-5 w-5 text-gray-400 dark:text-gray-400" />
                    </Combobox.Button>
                </div>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setQuery("")}
                >
                    <Combobox.Options className="absolute mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-gray-50 dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                        {filteredData.length === 0 && query !== "" ? (
                            <div className="relative cursor-default text-sm select-none px-2.5 py-2 text-gray-700 dark:text-gray-50">
                                Nothing found.
                            </div>
                        ) : (
                            filteredData.map((item, idx) => (
                                <Combobox.Option
                                    key={idx}
                                    value={item}
                                    className={({ active }) =>
                                        `relative cursor-pointer select-none flex items-center gap-4 py-2 pl-4 pr-10 ${
                                            active
                                                ? "bg-primary-600 text-white"
                                                : "text-primary-950 dark:text-primary-50"
                                        }`
                                    }
                                >
                                    {({ selected, active }) => (
                                        <>
                                            <span
                                                className={`block truncate ${
                                                    selected
                                                        ? "font-medium"
                                                        : "font-normal"
                                                }`}
                                            >
                                                {item}
                                            </span>
                                            {selected ? (
                                                <span
                                                    className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                                        active
                                                            ? "text-primary-50"
                                                            : "text-primary-600"
                                                    }`}
                                                >
                                                    <FaCheck className="h-5 w-5" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Combobox.Option>
                            ))
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

interface ListProps {
    data: (string | number)[];
    value: string | number;
    onChange: (value: string | number) => void;
}

export const List: React.FC<ListProps> = ({ data, value, onChange }) => {
    return (
        <Listbox value={value} onChange={(e) => onChange(e)}>
            <div className="relative w-full">
                <Listbox.Button className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                    <span className="block truncate">{value}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <LuChevronsUpDown
                            className="h-5 w-5 text-gray-400 dark:text-gray-400"
                            aria-hidden="true"
                        />
                    </span>
                </Listbox.Button>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {data.map((item, idx) => (
                            <Listbox.Option
                                key={idx}
                                value={item}
                                className={({ active }) =>
                                    `relative cursor-default select-none flex items-center gap-4 py-2 pl-4 pr-10 ${
                                        active
                                            ? "bg-primary-600 text-white"
                                            : "text-primary-950 dark:text-primary-50"
                                    }`
                                }
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                            }`}
                                        >
                                            {item}
                                        </span>
                                        {selected ? (
                                            <span
                                                className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                                                    active
                                                        ? "text-primary-50"
                                                        : "text-primary-600"
                                                }`}
                                            >
                                                <FaCheck className="h-5 w-5" />
                                            </span>
                                        ) : null}
                                    </>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Transition>
            </div>
        </Listbox>
    );
};
