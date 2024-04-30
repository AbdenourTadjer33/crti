import React, { Fragment, useEffect, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Input, InputLabel } from "@/Components/Forms/Input";
import { PrimaryButton } from "@/Components/Buttons/Button";
import { route } from "ziggy-js";
import { InputError } from "@/Components/Forms/InputError";
import months from "@/Data/months.json";
import { Listbox, Transition } from "@headlessui/react";
import { LuChevronsUpDown } from "react-icons/lu";
import { FaCheck } from "react-icons/fa";
import moment from "moment";

const RegisterForm = ({ username }: { username: string }) => {
    const DATE = new Date();
    const CURRENT_DAY = DATE.getDate();
    const CURRENT_MONTH = DATE.getMonth();
    const CURRENT_YEAR = DATE.getFullYear();

    // @ts-ignore
    const MONTHS: string[] = months[usePage().props.locale];
    // @ts-ignore

    const { data, setData, errors, post, processing } = useForm({
        fname: "",
        lname: "",
        dob: "",
        username: username || "",
        password: "",
    });

    const [dob, setDob] = useState({
        day: CURRENT_DAY,
        month: CURRENT_MONTH + 1,
        year: CURRENT_YEAR,
    });

    useEffect(() => {
        const date = moment({
            year: dob.year,
            month: dob.month - 1,
            day: dob.day,
        }).format("YYYY-MM-DD");
        setData("dob", String(date));
    }, [dob]);

    const registerHandler = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("register.store"), {
            preserveScroll: true,
            only: ["errors"],
        });
    };

    return (
        <form className="space-y-4 md:space-y-6" onSubmit={registerHandler}>
            <div className="grid sm:gap-2 gap-4 sm:grid-cols-2">
                <div>
                    <InputLabel className="mb-1" htmlFor="fname">
                        Prénom
                    </InputLabel>
                    <Input
                        id="fname"
                        isFocused
                        placeholder="Entrez votre prénom"
                        value={data.fname}
                        onChange={(e) => setData("fname", e.target.value)}
                    />
                    <InputError className="mt-1" message={errors.fname} />
                </div>
                <div>
                    <InputLabel className="mb-1" htmlFor="lname">
                        Nom
                    </InputLabel>
                    <Input
                        id="lname"
                        placeholder="Entrez votre nom"
                        value={data.lname}
                        onChange={(e) => setData("lname", e.target.value)}
                    />
                    <InputError className="mt-1" message={errors.lname} />
                </div>
            </div>

            <div>
                <InputLabel className="mb-1">Date de naissance</InputLabel>
                <div className="grid gap-1 grid-cols-3">
                    <Listbox
                        value={dob.day}
                        onChange={(e) => setDob({ ...dob, day: e })}
                    >
                        <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block p-2.5 pl-3 pr-10 text-left dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <span className="block truncate">
                                    {dob.day}
                                </span>
                                <span className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-2">
                                    <LuChevronsUpDown
                                        className="h-5 w-5 text-gray-400"
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
                                <Listbox.Options className="absolute mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-gray-50 dark:bg-gray-700 py-1 text-base shadow-lg focus:ring-primary-600 focus:outline-none z-50">
                                    {Array.from(
                                        {
                                            length: new Date(
                                                dob.year,
                                                dob.month,
                                                0
                                            ).getDate(),
                                        },
                                        (_, index) => index + 1
                                    ).map((day) => (
                                        <Listbox.Option
                                            key={day}
                                            value={day}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
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
                                                        {day}
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

                    <Listbox
                        value={dob.month}
                        onChange={(e) => setDob({ ...dob, month: e })}
                    >
                        <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block p-2.5 pl-3 pr-10 text-left dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <span className="block truncate">
                                    {MONTHS[dob.month - 1]}
                                </span>
                                <span className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-2">
                                    <LuChevronsUpDown
                                        className="h-5 w-5 text-gray-400"
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
                                <Listbox.Options className="absolute mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-gray-50 dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                                    {MONTHS.map((month, idx) => (
                                        <Listbox.Option
                                            key={idx}
                                            value={idx + 1}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
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
                                                        {month}
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

                    <Listbox
                        value={dob.year}
                        onChange={(e) => setDob({ ...dob, year: e })}
                    >
                        <div className="relative w-full">
                            <Listbox.Button className="relative w-full cursor-default bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:outline-none focus:ring-primary-600 focus:border-primary-600 block p-2.5 pl-3 pr-10 text-left dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
                                <span className="block truncate">
                                    {dob.year}
                                </span>
                                <span className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-2">
                                    <LuChevronsUpDown
                                        className="h-5 w-5 text-gray-400"
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
                                <Listbox.Options className="absolute mt-1.5 max-h-60 w-full overflow-auto rounded-md bg-gray-50 dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                                    {Array.from(
                                        { length: CURRENT_YEAR - 1939 },
                                        (_, index) => CURRENT_YEAR - index
                                    ).map((year, idx) => (
                                        <Listbox.Option
                                            key={idx}
                                            value={year}
                                            className={({ active }) =>
                                                `relative cursor-pointer select-none py-2 pl-4 pr-10 ${
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
                                                        {year}
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
                </div>
            </div>

            <div>
                <InputLabel className="mb-1" htmlFor="username">
                    Adresse e-mail
                </InputLabel>
                <Input
                    id="username"
                    placeholder="Entrez votre email professionnel"
                    value={data.username}
                    onChange={(e) => setData("username", e.target.value)}
                />
                <InputError className="mt-1" message={errors.username} />
            </div>

            <div>
                <InputLabel className="mb-1" htmlFor="password">
                    Mot de passe
                </InputLabel>
                <Input
                    id="password"
                    type="password"
                    placeholder="******"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                />
                <InputError className="mt-1" message={errors.password} />
            </div>

            <div>
                <PrimaryButton
                    disabled={processing}
                    type="submit"
                    className="w-full"
                >
                    S'inscrire
                </PrimaryButton>
            </div>
        </form>
    );
};

export default RegisterForm;
