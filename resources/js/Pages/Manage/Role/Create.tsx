import { Head, Link, useForm } from "@inertiajs/react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Permission } from "@/types";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import { House } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import { Button, buttonVariants } from "@/Components/ui/button";
import { cn } from "@/Utils/utils";
import React from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.role.index"), label: "Roles & permissions" },
    { label: "Créer role" },
];

const Create = ({ permissions }: { permissions: Permission[] }) => {
    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm<{
            name: string;
            description: string;
            permissions: string[];
        }>({
            name: "",
            description: "",
            permissions: [],
        });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.role.store"), {
            only: ["errors", "flash"],
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <div className="space-y-4">
            <Head title="Créer role" />
            <Breadcrumb items={breadcrumbs} />

            <div>
                <Heading level={3} className="font-medium">
                    Créer un nouveau role
                </Heading>

                <Text>
                    Votre modèle de tableau de bord de gestion d'accées.
                </Text>
            </div>

            <FormWrapper className="space-y-4" onSubmit={submit}>
                <div className="space-y-1">
                    <Label htmlFor="name" required>
                        Role
                    </Label>
                    <Input
                        id="name"
                        value={data.name}
                        onChange={(e) => {
                            clearErrors("name");
                            setData("name", e.target.value);
                        }}
                        autoComplete="off"
                        autoFocus
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        className="min-h-[60px]"
                        value={data.description}
                        onChange={(e) => {
                            clearErrors("description");
                            setData("description", e.target.value);
                        }}
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="space-y-1">
                    <ToggleGroup
                        type="multiple"
                        className="space-y-2.5"
                        value={data.permissions}
                        onValueChange={(values) =>
                            setData("permissions", values)
                        }
                    >
                        {permissions.map((permission, idx) => (
                            <ToggleGroupItem
                                key={idx}
                                value={permission.name}
                                className="p-4 w-full text-sm text-start rounded-md ring-offset-white transition-colors hover:bg-gray-100 hover:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-gray-100 data-[state=on]:text-gray-900 dark:ring-offset-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-400 dark:focus-visible:ring-gray-300 dark:data-[state=on]:bg-gray-800 dark:data-[state=on]:text-gray-50"
                            >
                                <p className="text-lg font-medium">
                                    {permission.label}
                                </p>
                                <p>{permission.description}</p>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </div>

                <div className="max-w-lg mx-auto flex justify-center gap-2">
                    <Link
                        href={route("manage.role.index")}
                        as="button"
                        type="button"
                        disabled={processing}
                        className={cn(
                            buttonVariants({ variant: "destructive" }),
                            "w-full"
                        )}
                    >
                        Annuler
                    </Link>
                    <Button
                        variant="primary"
                        className="w-full"
                        disabled={processing}
                    >
                        Créer
                    </Button>
                </div>
            </FormWrapper>

            <pre>{JSON.stringify({ permissions }, null, 2)}</pre>
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
