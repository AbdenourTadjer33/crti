import React from "react";
import AuthLayout from "@/Layouts/AuthLayout";
import Breadcrumb from "@/Components/common/breadcrumb";
import { Head, Link, useForm } from "@inertiajs/react";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import { FormWrapper } from "@/Components/ui/form";
import { House } from "lucide-react";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { InputError } from "@/Components/ui/input-error";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/Utils/utils";
import { capitalize } from "@/Utils/helper";
import * as Card from "@/Components/ui/card";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button, buttonVariants } from "@/Components/ui/button";
import { LabelInfo } from "@/Components/ui/label-info";
import { CheckedState } from "@radix-ui/react-checkbox";

const breadcrumbs = [
    { href: route("app"), label: <House className="w-5 h-5" /> },
    { href: route("manage.index"), label: "Centres d'administration" },
    { href: route("manage.role.index"), label: "Roles & permissions" },
    { label: "Créer role" },
];

interface DefaultParams {
    params: Record<string, string[]>;
    trans: Record<
        string,
        {
            name: string;
            actions: Record<
                string,
                {
                    name: string;
                    description: string;
                }
            >;
        }
    >;
}

const Create = ({ defaultParams }: { defaultParams: DefaultParams }) => {
    const { params, trans } = React.useMemo(() => defaultParams, []);

    const { data, setData, errors, clearErrors, post, reset, processing } =
        useForm<{
            name: string;
            description: string;
            default: Record<string, string[]>;
        }>({
            name: "",
            description: "",
            default: {},
        });

    // Handle checkbox toggle
    const handleCheckboxChange = (feature: string, action: string) => {
        const state = { ...data.default };

        if (!state[feature]) {
            state[feature] = [];
        }

        if (state[feature].includes(action)) {
            state[feature] = state[feature].filter((a) => a !== action);
        } else {
            state[feature].push(action);
        }

        setData("default", state);
    };

    const handleFeatureCheckbox = (checked: CheckedState, feature: string) => {
        if (checked === "indeterminate" || checked) {
            setData((data) => {
                data.default[feature] = params[feature];
                return { ...data };
            });

            return;
        }

        setData((data) => {
            data.default[feature] = [];
            return { ...data };
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("manage.role.store"), {
            preserveScroll: (page) => !Object.keys(page.props.errors).length,
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
                    Utilisez cette page pour créer de nouveaux rôles au sein du
                    système. Les rôles aident à définir les responsabilités des
                    utilisateurs en regroupant des autorisations spécifiques.
                    Personnalisez les rôles pour garantir que les utilisateurs
                    disposent du niveau d'accès correct en fonction de leur
                    poste ou de leurs tâches.{" "}
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

                <div className="space-y-4">
                    {Object.keys(params).map((feature, idx) => {
                        const actions = params[feature];
                        return (
                            <React.Fragment key={idx}>
                                <Card.Card className="p-4 flex flex-col gap-4">
                                    <div>
                                        <label className="sm:text-2xl text-xl font-semibold leading-none tracking-tight flex items-center space-x-2 select-none">
                                            <Checkbox
                                                value={feature}
                                                onCheckedChange={(checked) =>
                                                    handleFeatureCheckbox(
                                                        checked,
                                                        feature
                                                    )
                                                }
                                                checked={
                                                    data.default?.[feature]
                                                        ?.length ===
                                                    params[feature].length
                                                        ? true
                                                        : data.default?.[
                                                              feature
                                                          ]?.length > 0
                                                        ? "indeterminate"
                                                        : false
                                                }
                                            />
                                            <span>
                                                {capitalize(
                                                    trans?.[feature]?.name ??
                                                        feature
                                                )}
                                            </span>
                                        </label>
                                    </div>
                                    <div className="lg:ml-80 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                                        {actions.map((action, aIdx) => (
                                            <div
                                                className="flex items-center"
                                                key={aIdx}
                                            >
                                                <LabelInfo>
                                                    {trans[feature].actions[
                                                        action
                                                    ]?.description ||
                                                        "Aucune description fournie"}
                                                </LabelInfo>
                                                <label
                                                    key={aIdx}
                                                    className="inline-flex items-center space-x-2 select-none"
                                                >
                                                    <Checkbox
                                                        value={action}
                                                        checked={
                                                            data.default[
                                                                feature
                                                            ]?.includes(
                                                                action
                                                            ) || false
                                                        }
                                                        onCheckedChange={() =>
                                                            handleCheckboxChange(
                                                                feature,
                                                                action
                                                            )
                                                        }
                                                    />
                                                    <span className="text-sm md:text-base">
                                                        {capitalize(
                                                            trans[feature]
                                                                .actions[action]
                                                                .name
                                                        )}
                                                    </span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </Card.Card>
                            </React.Fragment>
                        );
                    })}
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
        </div>
    );
};

// @ts-ignore
Create.layout = (page) => <AuthLayout children={page} />;

export default Create;
