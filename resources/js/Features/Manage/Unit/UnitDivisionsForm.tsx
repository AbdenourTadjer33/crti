import * as React from "react";
import { usePage } from "@inertiajs/react";
import {
    CreateUnitContext,
    DivisionForm,
} from "@/Features/Manage/Unit/CreateForm";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import * as TanstackTable from "@tanstack/react-table";
import { RowSelectionState } from "@tanstack/react-table";
import { columnDef } from "../User/columns";
import { TableWraper } from "@/Components/ui/table";
import { MdAdd, MdSearch } from "react-icons/md";
import DataTable from "@/Components/DataTable";
import { useMediaQuery } from "@/Hooks/use-media-query";
import { Heading } from "@/Components/ui/heading";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/ui/accordion";
import debounce from "lodash.debounce";
import { searchUsers } from "@/Services/api/users";

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

    function canAddMoreDivisions(): boolean {
        for (const division of data.divisions) {
            if (!division.valid) {
                return false;
            }
        }

        return true;
    }

    React.useEffect(() => {
        if (!data.divisions.length) {
            newDivision();
        }
    }, []);

    return (
        <div className="space-y-2">
            {data.divisions.map((division, divisionIdx) =>
                !division.valid ? (
                    <DivisionInformationForm
                        key={divisionIdx}
                        divisionIdx={divisionIdx}
                        division={division}
                    />
                ) : (
                    <DivisionWidget
                        key={divisionIdx}
                        divisionIdx={divisionIdx}
                        division={division}
                    />
                )
            )}

            {canAddMoreDivisions() && (
                <Button variant="link" onClick={newDivision}>
                    Ajouter une division
                </Button>
            )}
        </div>
    );
};

const DivisionInformationForm = ({
    division,
    divisionIdx,
}: {
    division: DivisionForm;
    divisionIdx: number;
}) => {
    const { errors, setData } = React.useContext(CreateUnitContext);

    const validateDivision = () => {
        if (!division.name) return;
        setData((data) => {
            data.divisions[divisionIdx].valid = true;
            return { ...data };
        });
    };

    const cancelDivision = () => {
        setData((data) => {
            data.divisions.splice(divisionIdx, 1);
            return { ...data };
        });
    };

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-500 grid grid-cols-3 gap-4">
            <div className="space-y-1 col-span-2">
                <Label>Nom de division</Label>
                <Input
                    autoFocus
                    value={division.name}
                    name={`divisions.0.name`}
                    onChange={(e) =>
                        setData((data) => {
                            data.divisions[divisionIdx].name = e.target.value;
                            return { ...data };
                        })
                    }
                />
                <InputError message={errors[`divisions.${divisionIdx}.name`]} />
            </div>
            <div className="space-y-1 col-span-1">
                <Label>Abréviation</Label>
                <Input
                    value={division.abbr}
                    onChange={(e) =>
                        setData((data) => {
                            data.divisions[divisionIdx].abbr = e.target.value;
                            return { ...data };
                        })
                    }
                />
                <InputError message={errors[`divisions.${divisionIdx}.abbr`]} />
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
                    message={errors[`divisions.${divisionIdx}.description`]}
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
                                <Button type="button" className="sm:hidden">
                                    <MdAdd className="w-4 h-4 mr-2" />
                                    Ajouter un utilisateur
                                </Button>
                            </div>
                            <SelectDivisionMembers divisionIdx={divisionIdx} />
                        </AccordionContent>
                    </AccordionItem>
                    {!!division.members.length && (
                        <AccordionItem value="2">
                            <AccordionTrigger>
                                Ajouter le role des members dans la division
                            </AccordionTrigger>
                            <AccordionContent>
                                <DivisionMembers divisionIdx={divisionIdx} />
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
            <div className="inline-flex gap-4 col-span-3">
                <Button
                    type="button"
                    className="w-full"
                    variant="destructive"
                    onClick={() => cancelDivision()}
                >
                    Annuler
                </Button>
                <Button
                    type="button"
                    className="w-full"
                    variant="primary"
                    onClick={() => validateDivision()}
                >
                    Ajouter
                </Button>
            </div>
        </div>
    );
};


const DivisionWidget = ({
    division,
    divisionIdx,
}: {
    division: DivisionForm;
    divisionIdx: number;
}) => {
    const { setData } = React.useContext(CreateUnitContext);

    const invalidate = () => {
        setData((data) => {
            delete data.divisions[divisionIdx].valid;
            return { ...data };
        });
    };

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border dark:border-gray-500 flex justify-between">
            <ul>
                <li>
                    {division.name} {division.abbr && `(${division.abbr})`}
                </li>
                <li>{division.description}</li>
            </ul>
            <Button
                variant="link"
                onClick={invalidate}
                className=" place-self-end"
            >
                Modifier
            </Button>
        </div>
    );
};

const SelectDivisionMembers = ({ divisionIdx }: { divisionIdx: number }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { users } = usePage().props;
    const finalData = React.useMemo(() => users.data, [users.data]);
    const finalColumnDef = React.useMemo(() => columnDef, []);
    const [filtering, setFiltering] = React.useState<string>("");
    const [selected, setSelected] = React.useState<RowSelectionState>({});
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(false);
    const { data, setData } = React.useContext(CreateUnitContext);

    const searchUsersCallback = React.useCallback(async () => {
        setIsLoading(true);
        const result = await searchUsers(searchQuery);
        if (result.length) {
            // setTableData(result);
        }
        setIsLoading(false);
    }, [searchQuery]);

    const debouncedSearching = React.useMemo(
        () => debounce(searchUsersCallback, 500),
        [searchUsersCallback]
    );

    const table = TanstackTable.useReactTable({
        columns: finalColumnDef,
        data: finalData,
        getCoreRowModel: TanstackTable.getCoreRowModel(),
        getFilteredRowModel: TanstackTable.getFilteredRowModel(),
        getRowId: (row) => row.uuid,
        onGlobalFilterChange: setFiltering,
        onRowSelectionChange: setSelected,
        state: {
            globalFilter: filtering,
            rowSelection: selected,
            columnVisibility: {
                uuid: isDesktop,
                createdAt: false,
                updatedAt: false,
                status: false,
                Actions: false,
            },
        },
    });

    React.useEffect(() => {
        const members = data.divisions[divisionIdx].members;
        if (members.length) {
            setSelected(() =>
                members.reduce((acc: RowSelectionState, member) => {
                    acc[member.uuid] = true;
                    return acc;
                }, {})
            );
        }
    }, []);

    React.useEffect(() => {
        setData((data) => {
            data.divisions[divisionIdx].members = Object.keys(selected).map(
                (uuid) => {
                    console.log(table.getRowModel().rowsById?.[uuid].original);
                    return {
                        ...table.getRowModel().rowsById?.[uuid].original,
                        grade: "",
                    };
                }
            );
            return { ...data };
        });
    }, [selected]);

    React.useEffect(() => {
        if (searchQuery) {
            debouncedSearching();
        }

        return () => {
            debouncedSearching.cancel();
        };
    }, [debouncedSearching]);

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

const DivisionMembers = ({ divisionIdx }: { divisionIdx: number }) => {
    const { data, setData } = React.useContext(CreateUnitContext);

    return (
        <div className="py-0.5 space-y-4">
            {data.divisions[divisionIdx].members.map((member, idx) => (
                <div
                    key={idx}
                    className="grid sm:grid-cols-2 gap-4 bg-gray-100 dark:bg-gray-800/90 p-2 rounded border dark:border-gray-500"
                >
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-start"
                    >
                        {member.name}
                    </Button>
                    <Input
                        value={member.grade}
                        onChange={(e) =>
                            setData((data) => {
                                data.divisions[divisionIdx].members[idx].grade =
                                    e.target.value;
                                return { ...data };
                            })
                        }
                        placeholder={`Entrez le grade de ${member.name}`}
                    />
                </div>
            ))}
        </div>
    );
}

export { UnitDivisionsForm };
