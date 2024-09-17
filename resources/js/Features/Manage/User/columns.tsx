import { User } from "@/types";
import { createColumnHelper } from "@tanstack/react-table";
import {
    Check,
    ChevronsUpDown,
    MoreHorizontal,
    SquareArrowOutUpRight,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogContent,
} from "@/Components/ui/dialog";
import React from "react";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandHeader,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import { InputError } from "@/Components/ui/input-error";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { Input } from "@/Components/ui/input";

const columnHelper = createColumnHelper<User>();

export const columnDef = [
    columnHelper.display({
        id: "selecter",
        header: ({ table }) => <HeaderSelecter table={table} />,
        cell: ({ row }) => <RowSelecter row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.display({
        id: "expander",
        cell: ({ row }) => <RowExpander row={row} />,
        enableHiding: false,
        enableSorting: false,
    }),

    columnHelper.accessor("uuid", {
        header: "Id",
    }),

    columnHelper.accessor("name", {
        header: "Nom prénom",
        cell: ({ row, getValue }) => (
            <Link
                href={route("manage.user.show", { user: row.id })}
                className="inline-flex items-center hover:text-blue-600 duration-100"
            >
                {getValue()}{" "}
                <SquareArrowOutUpRight className="h-4 w-4 ml-1.5" />
            </Link>
        ),
    }),

    columnHelper.accessor("email", {
        // header: "Adresse e-mail",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                </Button>
            );
        },
        cell: ({ row }) => {
            const { uuid, email, status } = row.original;
            return (
                <div className="flex items-center  gap-2">
                    <span className="inline-flex items-center gap-2">
                        {email}
                        {!status && <Badge variant="red">User not</Badge>}
                    </span>
                    {!status && (
                        <div className="flex gap-2">
                            <form
                                className="flex"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    router.visit(
                                        route("manage.user.destroy", {
                                            user: uuid,
                                        }),
                                        {
                                            method: "delete",
                                        }
                                    );
                                }}
                            >
                                <Button>Rejeter</Button>
                            </form>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    router.visit(
                                        route("manage.user.approve", {
                                            user: uuid,
                                        }),
                                        {
                                            method: "post",
                                        }
                                    );
                                }}
                            >
                                <Button variant="primary">Approuver</Button>
                            </form>
                        </div>
                    )}
                </div>
            );
        },
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer le",
        cell: ({ getValue }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {formatDistanceToNow(getValue()!, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {format(getValue()!, "dd MMM yyy hh:mm", {
                                    locale: fr,
                                })}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),

    columnHelper.accessor("updatedAt", {
        header: "Modifier le",
        cell: ({ getValue }) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            {formatDistanceToNow(getValue()!, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>
                                {format(getValue()!, "dd MMM yyy hh:mm", {
                                    locale: fr,
                                })}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    }),

    columnHelper.display({
        id: "Actions",
        cell: ({ row }) => {
            const id = row.id;
            const [affectationDialog, setAffectationDialog] =
                React.useState(false);
            const { userDivisions, divisions } = usePage().props;

            const { data, setData } = useForm({
                divisions: [],
            });

            useUpdateEffect(() => {
                setData((data) => {
                    data.divisions = [...userDivisions, ...data.divisions];
                    return { ...data };
                });
            }, [userDivisions]);

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            loop
                        >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() =>
                                    navigator.clipboard.writeText(id)
                                }
                            >
                                Copier l'ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    router.reload({
                                        only: ["userDivisions"],
                                        data: { uuid: id },
                                    });
                                    setAffectationDialog(true);
                                }}
                            >
                                Gerer les affectation
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem asChild>
                                <Pencil className="w-4 h-4 mr-2" />
                                Modifier
                            </DropdownMenuItem> */}
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Êtes-vous sûr de vouloir supprimer cet utilisateur ?"
                                        )
                                    ) {
                                        router.delete(
                                            route("manage.user.destroy", {
                                                user: id,
                                            })
                                        );
                                    }
                                }}
                            >
                                Supprimé
                            </DropdownMenuItem>
                            <DropdownMenuItem>Blocker</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog
                        open={affectationDialog}
                        onOpenChange={setAffectationDialog}
                        modal={false}
                    >
                        <DialogContent
                            className="max-w-screen-lg space-y-4"
                            onFocusOutside={(e) => e.preventDefault()}
                        >
                            <DialogHeader>
                                <DialogTitle>Divisions associées</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>

                            <div className="max-h-80 overflow-auto">
                                <div className=" bg-white divide-y divide-gray-200">
                                    {userDivisions === undefined
                                        ? "loading"
                                        : userDivisions?.map((div, idx) => (
                                              <div key={idx}>{div.name}</div>
                                          ))}
                                </div>
                                <div>
                                    {data.divisions?.map((division) => (
                                        <div>
                                            <Input defaultValue={division?.name} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="justify-between w-full"
                                            onClick={() => {
                                                router.reload({
                                                    only: ["divisions"],
                                                });
                                            }}
                                        >
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="p-0 w-auto"
                                        asChild
                                    >
                                        <Command>
                                            <CommandHeader>
                                                <CommandInput placeholder="Rechercher une division..." />
                                            </CommandHeader>
                                            <CommandEmpty>
                                                Aucune division trouvée.
                                            </CommandEmpty>
                                            <CommandList>
                                                <CommandGroup>
                                                    {divisions &&
                                                        divisions.map(
                                                            (div, idx) => (
                                                                <CommandItem
                                                                    key={idx}
                                                                >
                                                                    {div.name}
                                                                </CommandItem>
                                                            )
                                                        )}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </DialogContent>
                    </Dialog>
                </>
            );
        },
        enableHiding: false,
    }),
];
