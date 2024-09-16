import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";
import { Text } from "@/Components/ui/paragraph";
import AuthLayout from "@/Layouts/AuthLayout";
import WorkspaceLayout from "@/Layouts/workspace-layout";
import * as Card from "@/Components/ui/card";
import * as Tooltip from "@/Components/ui/tooltip";
import { Badge } from "@/Components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { currencyFormat, getInitials } from "@/Utils/helper";
import { Editor } from "@/Components/Editor";
import { ResourceTable } from "@/Features/Project/ResourceTable";
import { createColumnHelper } from "@tanstack/react-table";
import { TaskForm } from "@/types/form";
import UserAvatar from "@/Components/common/user-hover-avatar";
import * as TanstackTable from "@tanstack/react-table";
import { TableWrapper } from "@/Components/ui/table";
import DataTable from "@/Components/common/data-table";
import { fr } from "date-fns/locale";

const Show: React.FC<any> = ({ version }) => {
    const [processing, setProcessing] = React.useState(false);
    const { data, natures, domains } = version;

    function accept() {
        const URL = route("project.version.accept", {
            project: route().params.project,
            version: route().params.version,
        });

        router.visit(URL, {
            method: "post",
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    function reject() {
        const URL = route("project.version.reject", {
            project: route().params.project,
            version: route().params.version,
        });

        router.visit(URL, {
            method: "post",
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <div className="space-y-4">
            <Head title="Version" />

            <div className="space-y-2">
                <Heading level={3} className="font-medium">
                    Version suggére #{version.id}
                </Heading>
            </div>

            <ol className="relative border-s border-gray-200 dark:border-gray-700 space-y-10">
                <li className="ms-4">
                    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>

                    <Text className="mb-1 text-sm">
                        Suggéré par <strong>{version.creator.name}</strong>{" "}
                        <time className="text-sm font-normal leading-none text-gray-500 dark:text-gray-300">
                            {formatDistanceToNow(version.createdAt, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </time>
                    </Text>

                    <div className="space-y-1 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {/* {version.name} */}
                        </h3>

                        {version.reason && (
                            <blockquote className="text-base italic font-normal text-gray-500 dark:text-gray-50">
                                "{version.reason}"
                            </blockquote>
                        )}
                    </div>

                    <Card.Card>
                        <Card.CardHeader className="sm:p-6 p-4">
                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Card.CardTitle className="sm:text-2xl text-xl">
                                            {data.name}
                                        </Card.CardTitle>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        Titre de projet
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                            <Tooltip.TooltipProvider>
                                <Tooltip.Tooltip>
                                    <Tooltip.TooltipTrigger asChild>
                                        <Card.CardSubTitle className="sm:text-xl text-lg">
                                            {
                                                natures?.find(
                                                    (n) =>
                                                        String(n.id) ===
                                                        data.nature
                                                )?.name
                                            }
                                        </Card.CardSubTitle>
                                    </Tooltip.TooltipTrigger>
                                    <Tooltip.TooltipContent>
                                        Nature de projet
                                    </Tooltip.TooltipContent>
                                </Tooltip.Tooltip>
                            </Tooltip.TooltipProvider>
                        </Card.CardHeader>
                        <Card.CardContent className="sm:p-6 p-4 pt-0 sm:pt-0 space-y-4 sm:space-y-6">
                            <div className="space-y-2">
                                <Heading level={6}>Domaines</Heading>

                                <div className="flex flex-wrap items-center gap-1.5">
                                    {data.domains.map((domain, idx) => (
                                        <Badge
                                            key={idx}
                                            variant="blue"
                                            size="sm"
                                        >
                                            {
                                                domains?.find(
                                                    (d) =>
                                                        String(d.id) === domain
                                                )?.name
                                            }
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Heading level={6}>Chronologie</Heading>

                                <div className="text-gray-600">
                                    {`Du ${format(
                                        data.timeline.from!,
                                        "dd MMMM yyy"
                                    )} au ${format(
                                        data.timeline.to!,
                                        "dd MMMM yyy"
                                    )}`}
                                </div>
                            </div>

                            <div className="flex md:flex-row flex-col md:items-start gap-4">
                                <Card.Card className="flex-1 md:max-w-md w-full">
                                    <Card.CardHeader>
                                        <Card.CardTitle className="sm:text-2xl text-xl">
                                            Membres de l'équipe de projet
                                        </Card.CardTitle>
                                        <Card.CardDescription>
                                            Les membres de votre équipe.
                                        </Card.CardDescription>
                                    </Card.CardHeader>
                                    <Card.CardContent className="grid gap-6">
                                        {data.members.map((member) => (
                                            <div
                                                key={member.uuid}
                                                className="flex items-center justify-between space-x-4"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {getInitials(
                                                                member.name
                                                            )}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">
                                                            {member.name}{" "}
                                                            {member.uuid ===
                                                                null && (
                                                                <span className="font-semibold">
                                                                    (Porteur)
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600">
                                                            {member.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Card.CardContent>
                                </Card.Card>

                                {data.is_partner && (
                                    <Card.Card className="flex-1 md:max-w-md w-full">
                                        <Card.CardHeader>
                                            <Card.CardTitle className="sm:text-2xl text-xl">
                                                Partenaire socio-économique
                                            </Card.CardTitle>
                                            <Card.CardDescription>
                                                Information sur le partenaire
                                                socio-économique
                                            </Card.CardDescription>
                                        </Card.CardHeader>
                                        <Card.CardContent className="space-y-4">
                                            <div className="space-y-1">
                                                <Text>
                                                    Organisation:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {
                                                            data.partner
                                                                .organisation
                                                        }
                                                    </span>
                                                </Text>
                                                <Text>
                                                    Secteur:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {data.partner.sector}
                                                    </span>
                                                </Text>
                                            </div>
                                            <div className="space-y-1">
                                                <Text>
                                                    Nom du contact:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {
                                                            data.partner
                                                                .contact_name
                                                        }
                                                    </span>
                                                </Text>
                                                <Text>
                                                    Post du contact:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {
                                                            data.partner
                                                                .contact_post
                                                        }
                                                    </span>
                                                </Text>
                                                <Text>
                                                    N° téléphone:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {
                                                            data.partner
                                                                .contact_phone
                                                        }
                                                    </span>
                                                </Text>
                                                <Text>
                                                    Adresse e-mail:{" "}
                                                    <span className="text-gray-800 font-medium">
                                                        {
                                                            data.partner
                                                                .contact_email
                                                        }
                                                    </span>
                                                </Text>
                                            </div>
                                        </Card.CardContent>
                                    </Card.Card>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Heading level={6}>
                                    Description succincte du projet
                                </Heading>
                                <Editor
                                    autofocus={false}
                                    content={data.description}
                                    editable={false}
                                    classNames={{ content: "resize-none" }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Heading level={6}>Objectifs du projet</Heading>
                                <Editor
                                    autofocus={false}
                                    content={data.goals}
                                    editable={false}
                                    classNames={{ content: "resize-none" }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Heading level={6}>
                                    Méthodologies pour la mise en œuvre du
                                    projet
                                </Heading>
                                <Editor
                                    autofocus={false}
                                    content={data.methodology}
                                    editable={false}
                                    classNames={{ content: "resize-none" }}
                                />
                            </div>

                            <div className="space-y-2">
                                <Heading level={6}>Tâches</Heading>
                                <TaskTable
                                    tasks={data.tasks}
                                    members={data.members}
                                />
                            </div>

                            {data.resources.length ? (
                                <div className="space-y-2">
                                    <Heading level={6}>
                                        Matériel existant pouvant être utilisé
                                        dans l'exécution du projet.
                                    </Heading>
                                    <ul className="flex flex-wrap items-center justify-start gap-4">
                                        {data.resources?.map(
                                            (resource, idx) => (
                                                <li key={idx}>
                                                    <Card.Card className="p-4 flex items-center justify-between">
                                                        <div className="flex flex-col">
                                                            <Card.CardSubTitle className="text-sm font-normal">
                                                                {resource.code}
                                                            </Card.CardSubTitle>
                                                            <Card.CardTitle className="text-base font-medium">
                                                                {resource.name}
                                                            </Card.CardTitle>
                                                        </div>
                                                    </Card.Card>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            ) : null}

                            {data.resources_crti.length ? (
                                <div className="space-y-2">
                                    <Heading level={6}>
                                        Matière première, composants et petits
                                        équipements à acquérir par le CRTI
                                    </Heading>

                                    <ResourceTable
                                        resources={data.resources_crti}
                                    />
                                </div>
                            ) : null}

                            {data.is_partner && data.resources_partner ? (
                                <div className="space-y-2">
                                    <Heading level={6}>
                                        Matière première, composants et petits
                                        équipements à acquérir par le partenaire
                                        socio-économique
                                    </Heading>

                                    <ResourceTable
                                        resources={data.resources_partner}
                                    />
                                </div>
                            ) : null}

                            <Card.Card className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <Heading level={6}>
                                        Produit livrable du projet
                                    </Heading>
                                    <ul className="list-disc list-inside">
                                        {data.deliverables.map(
                                            (deliverable, idx) => (
                                                <li key={idx}>{deliverable}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                <div className="inline-flex items-center gap-2">
                                    <Heading level={6} className="font-medium">
                                        Montant Globale estimé pour la
                                        réalisation du projet
                                    </Heading>
                                    <span className="text-gray-800 text-2xl">
                                        {currencyFormat(data.estimated_amount)}
                                    </span>
                                </div>
                            </Card.Card>
                        </Card.CardContent>
                        <Card.CardFooter className="sm:p-6 p-4 pt-0 sm:pt-0 flex gap-4 max-w-lg mx-auto">
                            <Button
                                variant="secondary"
                                className="w-full dark:bg-gray-700 dark:hover:bg-gray-700/50"
                                onClick={reject}
                                disabled={processing}
                            >
                                Rejeter
                            </Button>
                            <Button
                                variant="primary"
                                className="w-full"
                                onClick={accept}
                                disabled={processing}
                            >
                                Accepter
                            </Button>
                        </Card.CardFooter>
                    </Card.Card>
                </li>
            </ol>
        </div>
    );
};

const columnHelper = createColumnHelper<TaskForm>();

const columnDef = [
    columnHelper.display({
        id: "index",
        cell: ({ row }) => row.id,
    }),
    columnHelper.accessor("name", {
        header: "tâche",
    }),

    columnHelper.accessor("description", {
        header: "description",
        cell: ({ row }) => (
            <Button variant="link" onClick={row.getToggleExpandedHandler()}>
                {!row.getIsExpanded()
                    ? "Voir la description"
                    : "Cacher la description"}
            </Button>
        ),
    }),

    columnHelper.accessor("timeline", {
        header: "échancier",
        cell: ({ getValue }) =>
            `Du ${format(getValue().from!, "dd MMM yyy")} au ${format(
                getValue().to!,
                "dd MMM yyy"
            )}`,
    }),

    columnHelper.accessor("users", {
        header: "assigné à",
        cell: ({ getValue }) => {
            return (
                <div className="flex items-center -space-x-1.5">
                    {getValue().map((member) => (
                        <UserAvatar key={member.uuid} user={member} />
                    ))}
                </div>
            );
        },
    }),

    columnHelper.accessor("priority", {
        header: "priorité",
    }),
];

const TaskTable: React.FC<any> = ({ tasks, members }) => {
    const columns = React.useMemo(() => columnDef, [columnDef]);
    const data = React.useMemo(() => {
        let t: any[] = [];

        tasks.forEach((task: any) => {
            t.push({
                ...task,
                users: members.filter((m: any) => task.users.includes(m.uuid)),
            });
        });

        return t;
    }, [tasks, members]);

    const table = TanstackTable.useReactTable({
        data,
        columns,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getRowId: (_, index) => String(index + 1),
        getRowCanExpand: () => true,
        getExpandedRowModel: TanstackTable.getExpandedRowModel(),
    });

    return (
        <TableWrapper className="shadow-none">
            <DataTable
                options={{
                    table,
                    subComponent: ({ row }: any) => {
                        return (
                            <Editor
                                editable={false}
                                content={row.original.description}
                                autofocus={false}
                                classNames={{ content: "resize-none" }}
                                className="-m-4 border-none"
                            />
                        );
                    },
                }}
            />
        </TableWrapper>
    );
};

// @ts-ignore
Show.layout = (page) => (
    <AuthLayout>
        <WorkspaceLayout children={page} />
    </AuthLayout>
);

export default Show;
