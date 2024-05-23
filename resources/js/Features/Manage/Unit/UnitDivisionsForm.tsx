import * as React from "react";
import { CreateUnitContext } from "@/Features/Manage/Unit/CreateForm";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import * as TanstackTable from "@tanstack/react-table";
import { columnDef } from "../User/columns";
import { TableWraper } from "@/Components/ui/table";
import { MdAdd, MdSearch } from "react-icons/md";
import DataTable from "@/Components/DataTable";
import { useMediaQuery } from "@/Hooks/use-media-query";
import { Heading } from "@/Components/ui/heading";
import { router, usePage } from "@inertiajs/react";
import { route } from "@/Utils/helper";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import debounce from "lodash.debounce";

const UnitDivisionsForm = () => {
    const { data, setData, errors } = React.useContext(CreateUnitContext);

    const newDivision = () => {
        setData((data) => {
            data.divisions.push({
                name: "",
                abbr: "",
                description: "",
                members: [],
            });
            return { ...data };
        });
    };

    const newMember = (divisionIdx: number) => {
        setData((data) => {
            data.divisions[divisionIdx].members.push({ uuid: "", role: "" });
            return { ...data };
        });
    };

    const validateDivision = () => {};

    React.useEffect(() => {
        newDivision();
    }, []);

    return (
        <div className="space-y-4">
            {data.divisions.map((division, divisionIdx) => (
                <div
                    key={divisionIdx}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-500 grid grid-cols-3 gap-4"
                >
                    <div className="space-y-1 col-span-2">
                        <Label>Nom de division</Label>
                        <Input
                            value={division.name}
                            onChange={(e) =>
                                setData((data) => {
                                    data.divisions[divisionIdx].name =
                                        e.target.value;
                                    return { ...data };
                                })
                            }
                        />
                        <InputError
                            message={errors[`divisions.${divisionIdx}.name`]}
                        />
                    </div>
                    <div className="space-y-1 col-span-1">
                        <Label>Abréviation</Label>
                        <Input
                            value={division.abbr}
                            onChange={(e) =>
                                setData((data) => {
                                    data.divisions[divisionIdx].abbr =
                                        e.target.value;
                                    return { ...data };
                                })
                            }
                        />
                        <InputError
                            message={errors[`divisions.${divisionIdx}.abbr`]}
                        />
                    </div>
                    <div className="space-y-1 col-span-3">
                        <Label>Description</Label>
                        <Textarea
                            value={division.description}
                            onChange={(e) =>
                                setData((data) => {
                                    data.divisions[divisionIdx].description =
                                        e.target.value;
                                    return { ...data };
                                })
                            }
                        />
                        <InputError
                            message={
                                errors[`divisions.${divisionIdx}.description`]
                            }
                        />
                    </div>
                    <div className="space-y-2 col-span-3">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="1">
                                <AccordionTrigger>
                                    Selectionnez les members de la divisions
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="flex items-center justify-between gap-2">
                                        <Button
                                            type="button"
                                            className="sm:hidden"
                                        >
                                            <MdAdd className="w-4 h-4 mr-2" />
                                            Ajouter un utilisateur
                                        </Button>
                                    </div>
                                    <DivisionMembers
                                        divisionIdx={divisionIdx}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="inline-flex gap-4 col-span-3">
                        <Button
                            type="button"
                            className="w-full"
                            variant="destructive"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            className="w-full"
                            variant="primary"
                        >
                            Ajouter
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const DivisionMembers = ({ divisionIdx }: { divisionIdx: number }) => {
    const { users } = usePage().props;
    const { data, setData } = React.useContext(CreateUnitContext);
    const finalData = React.useMemo(() => users.data, [users.data]);
    const finalColumnDef = React.useMemo(() => columnDef, []);
    const [filtering, setFiltering] = React.useState<string>("");
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const calculate = React.useCallback(() => {
        console.log(window);
    }, []);

    const debouncedCalculate = React.useMemo(
        () => debounce(calculate, 100),
        [calculate]
    );

    const searchUsers = React.useCallback(() => {
        router.get(
            route("manage.user.search", { query: searchQuery }),
            undefined,
            {}
        );
        router.visit(route("manage.user.search", { query: searchQuery }), {
            method: "get",
            preserveScroll: true,
            preserveState: true,
        });
    }, [searchQuery]);
    const debouncedSearchUsers = React.useMemo(
        () => debounce(searchUsers, 250),
        [searchUsers]
    );

    const table = TanstackTable.useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getFilteredRowModel: TanstackTable.getFilteredRowModel(),
        getRowId: (row) => row.uuid,
        onGlobalFilterChange: setFiltering,
        state: {
            globalFilter: filtering,
            columnVisibility: {
                uuid: isDesktop,
                createdAt: false,
                updatedAt: false,
                status: false,
                Actions: false,
            },
        },
    });

    React.useEffect(
        () =>
            setData((data) => {
                data.divisions[divisionIdx].members = Object.keys(
                    table.getState().rowSelection
                ).map((uuid) => {
                    return { uuid, role: "" };
                });
                return { ...data };
            }),
        [table.getState().rowSelection]
    );

    React.useEffect(() => {
        debouncedSearchUsers();

        return () => {
            debouncedSearchUsers.cancel();
        };
    }, [debouncedSearchUsers]);

    const noDataPlaceholder = (): React.ReactNode => {
        return (
            <Heading level={5}>
                Commencer à rechercher un utilisateur par son nom ou son adresse
                email ou son identifiant.
            </Heading>
        );
    };

    return (
        <TableWraper className="shadow-none">
            <div className="flex justify-between items-center py-3 px-4 gap-2">
                <div className="relative w-full sm:w-80">
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <MdSearch className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <Input
                        placeholder="search..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button type="button" className="hidden sm:inline-flex">
                    <MdAdd className="w-4 h-4 mr-2" />
                    Ajouter un utilisateur
                </Button>
            </div>

            <DataTable
                options={{
                    table,
                    noDataPlaceholder,
                    pagination: { links: users.links, meta: users.meta },
                }}
            />
        </TableWraper>
    );
};

export { UnitDivisionsForm };
