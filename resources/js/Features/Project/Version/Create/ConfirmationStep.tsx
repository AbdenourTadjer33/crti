import React from "react";
import * as Card from "@/Components/ui/card";
import * as TanstackTable from "@tanstack/react-table";
import DataTable from "@/Components/common/data-table";
import { StepperContentProps } from "@/Components/ui/stepper";
import { CreateProjectContext as ProjectContext } from "@/Contexts/Project/create-project-context";
import { Button } from "@/Components/ui/button";
import { router, usePage } from "@inertiajs/react";
import { format } from "date-fns";
import { ProjectForm } from "@/types/form";
import { Text } from "@/Components/ui/paragraph";
import { Heading } from "@/Components/ui/heading";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { currencyFormat, getInitials } from "@/Utils/helper";
import { useUser } from "@/Hooks/use-user";
import { Editor } from "@/Components/Editor";
import { columnDef } from "./task-columns";
import { columnDef as resourceColumnDef } from "./resource-columns";
import { TableWrapper } from "@/Components/ui/table";
import * as Tooltip from "@/Components/ui/tooltip";

function prepareData(data: Omit<ProjectForm, "creator">) {
    const formData: any = { ...data };

    formData.timeline.from = format(formData.timeline.from, "yyy-MM-dd");
    formData.timeline.to = format(formData.timeline.to, "yyy-MM-dd");

    formData.tasks.map((task: any) => {
        task.timeline.from = format(task.timeline.from, "yyy-MM-dd");
        task.timeline.to = format(task.timeline.to, "yyy-MM-dd");
    });

    return formData;
}

const ConfirmationStep = ({ prev }: StepperContentProps) => {
    const { uuid } = useUser("uuid");
    const { data } = React.useContext(ProjectContext);
    const [processing, setProcessing] = React.useState(false);

    const { domains, natures } = usePage<{
        domains: undefined | { id: number; name: string; suggested: boolean }[];
        natures: undefined | { id: number; name: string; suggested: boolean }[];
    }>().props;

    const submitHandler = () => {
        const formData = prepareData(data);

        const url = route("project.version.store", route().params.project);

        router.post(url, formData as any, {
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Card.Card>
                <Card.CardHeader className="sm:p-6 p-4">
                    <Text></Text>
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
                                            (n) => String(n.id) === data.nature
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
                                <Badge key={idx} variant="blue" size="sm">
                                    {
                                        domains?.find(
                                            (d) => String(d.id) === domain
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
                            )} au ${format(data.timeline.to!, "dd MMMM yyy")}`}
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
                                                    {getInitials(member.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium leading-none">
                                                    {member.name}{" "}
                                                    {member.uuid === uuid && (
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
                                                {data.partner.organisation}
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
                                                {data.partner.contact_name}
                                            </span>
                                        </Text>
                                        <Text>
                                            Post du contact:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {data.partner.contact_post}
                                            </span>
                                        </Text>
                                        <Text>
                                            N° téléphone:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {data.partner.contact_phone}
                                            </span>
                                        </Text>
                                        <Text>
                                            Adresse e-mail:{" "}
                                            <span className="text-gray-800 font-medium">
                                                {data.partner.contact_email}
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
                            Méthodologies pour la mise en œuvre du projet
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
                        <TaskTable tasks={data.tasks} />
                    </div>

                    {data.resources.length ? (
                        <div className="space-y-2">
                            <Heading level={6}>
                                Matériel existant pouvant être utilisé dans
                                l'exécution du projet.
                            </Heading>
                            <ul className="flex flex-wrap items-center justify-start gap-4">
                                {data.resources?.map((resource, idx) => (
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
                                ))}
                            </ul>
                        </div>
                    ) : null}

                    {data.resources_crti.length ? (
                        <div className="space-y-2">
                            <Heading level={6}>
                                Matière première, composants et petits
                                équipements à acquérir par le CRTI
                            </Heading>

                            <ResourceTable resources={data.resources_crti} />
                        </div>
                    ) : null}

                    {data.is_partner && data.resources_partner ? (
                        <div className="space-y-2">
                            <Heading level={6}>
                                Matière première, composants et petits
                                équipements à acquérir par le partenaire
                                socio-économique
                            </Heading>

                            <ResourceTable resources={data.resources_partner} />
                        </div>
                    ) : null}

                    <Card.Card className="p-6 space-y-6">
                        <div className="space-y-2">
                            <Heading level={6}>
                                Produit livrable du projet
                            </Heading>
                            <ul className="list-disc list-inside">
                                {data.deliverables.map((deliverable, idx) => (
                                    <li key={idx}>{deliverable}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="inline-flex items-center gap-2">
                            <Heading level={6} className="font-medium">
                                Montant Globale estimé pour la réalisation du
                                projet
                            </Heading>
                            <span className="text-gray-800 text-2xl">
                                {currencyFormat(data.estimated_amount)}
                            </span>
                        </div>
                    </Card.Card>
                </Card.CardContent>
                <Card.CardFooter className="sm:p-6 p-4 pt-0 sm:pt-0 flex gap-4 max-w-lg mx-auto">
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full"
                        disabled={processing}
                        onClick={prev}
                    >
                        Précendant
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full"
                        disabled={processing}
                        onClick={submitHandler}
                    >
                        Confirmer
                    </Button>
                </Card.CardFooter>
            </Card.Card>
        </>
    );
};

const TaskTable: React.FC<any> = ({ tasks }) => {
    const columns = React.useMemo(() => columnDef, [columnDef]);
    const data = React.useMemo(() => tasks, [tasks]);

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

const ResourceTable: React.FC<any> = ({ resources }) => {
    const columns = React.useMemo(() => resourceColumnDef, [resourceColumnDef]);
    const data = React.useMemo(() => resources, [resources]);

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
                    subComponent: ({ row }: any) => (
                        <Editor
                            editable={false}
                            autofocus={false}
                            content={row.original.description}
                            classNames={{ content: "resize-none" }}
                            className="-m-4 border-none"
                        />
                    ),
                    noDataPlaceholder: (
                        <div className="text-center text-xl font-medium">
                            Pas de ressources ajouté
                        </div>
                    ),
                }}
            />
        </TableWrapper>
    );
};

export default ConfirmationStep;
