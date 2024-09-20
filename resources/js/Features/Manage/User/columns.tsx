import React from "react";
import { User } from "@/types";
import { createColumnHelper, Row } from "@tanstack/react-table";
import {
    Ban,
    ChevronDown,
    ClipboardCopy,
    GitMerge,
    Key,
    LoaderCircle,
    MoreHorizontal,
    Pencil,
    Trash,
    X,
} from "lucide-react";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    HeaderSelecter,
    RowExpander,
    RowSelecter,
} from "@/Components/common/data-table";
import { Link, router, useForm, usePage } from "@inertiajs/react";
import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/Components/ui/badge";
import { useUpdateEffect } from "@/Hooks/use-update-effect";
import { cn } from "@/Utils/utils";
import { toast } from "sonner";
import { Heading } from "@/Components/ui/heading";
import * as Command from "@/Components/ui/command";
import * as Dialog from "@/Components/ui/dialog";
import * as Select from "@/Components/ui/select";
import * as DropdownMenu from "@/Components/ui/dropdown-menu";
import * as Tooltip from "@/Components/ui/tooltip";
import * as Popover from "@/Components/ui/popover";
import { Indicator } from "@/Components/ui/indicator";
import { InputError } from "@/Components/ui/input-error";

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
    }),

    columnHelper.accessor("email", {
        header: "Adresse e-mail",
        cell: ({ getValue, row }) => (
            <span className="flex items-center gap-2">
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger>
                            <Indicator color={row.original.emailVerified} />
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            {row.original.emailVerified
                                ? "Adresse e-mail verifé"
                                : "Adresse e-mail non verifé"}
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
                {getValue()}
            </span>
        ),
    }),

    columnHelper.accessor("title", {
        header: "Titre professionnel",
        cell: ({ getValue }) =>
            getValue() || <span className="font-medium">Non definie</span>,
    }),

    columnHelper.accessor("sex", {
        header: "Sexe",
    }),

    columnHelper.accessor("dob", {
        header: "Date de naissance",
        cell: ({ getValue }) => getValue() && format(getValue()!, "dd-MM-yyy"),
    }),

    columnHelper.accessor("createdAt", {
        header: "Créer le",
        cell: ({ getValue }) => {
            return (
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger>
                            {formatDistanceToNow(getValue()!, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>
                                {format(getValue()!, "dd MMM yyy hh:mm", {
                                    locale: fr,
                                })}
                            </p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
            );
        },
    }),

    columnHelper.accessor("updatedAt", {
        header: "Modifier le",
        cell: ({ getValue }) => {
            return (
                <Tooltip.TooltipProvider>
                    <Tooltip.Tooltip>
                        <Tooltip.TooltipTrigger>
                            {formatDistanceToNow(getValue()!, {
                                addSuffix: true,
                                locale: fr,
                            })}
                        </Tooltip.TooltipTrigger>
                        <Tooltip.TooltipContent>
                            <p>
                                {format(getValue()!, "dd MMM yyy hh:mm", {
                                    locale: fr,
                                })}
                            </p>
                        </Tooltip.TooltipContent>
                    </Tooltip.Tooltip>
                </Tooltip.TooltipProvider>
            );
        },
    }),

    columnHelper.accessor("lastActivity", {
        header: "Dernière activité",
        cell: ({ getValue }) => {
            return (
                getValue() ? (
                    <Tooltip.TooltipProvider>
                        <Tooltip.Tooltip>
                            <Tooltip.TooltipTrigger>
                                {formatDistanceToNow(getValue()!, {
                                    addSuffix: true,
                                    locale: fr,
                                })}
                            </Tooltip.TooltipTrigger>
                            <Tooltip.TooltipContent>
                                <p>
                                    {format(getValue()!, "dd MMM yyy hh:mm", {
                                        locale: fr,
                                    })}
                                </p>
                            </Tooltip.TooltipContent>
                        </Tooltip.Tooltip>
                    </Tooltip.TooltipProvider>
                ) : <span className="font-medium">Aucune activité</span>
            );
        },
    }),

    columnHelper.display({
        id: "Actions",
        cell: ({ row }) => <Actions row={row} />,
        enableHiding: false,
    }),
];

const Actions: React.FC<{ row: Row<User> }> = ({ row }) => {
    const [affectationDialog, setAffectationDialog] = React.useState(false);
    const [accessDialog, setAccessDialog] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const openAffectation = () => {
        router.reload({
            only: ["userDivisions", "unitsDivision", "grades"],
            data: { uuid: row.original.uuid },
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });

        setAffectationDialog(true);
    };

    const openAccess = () => {
        router.reload({
            only: ["userAccess"],
            data: { uuid: row.original.uuid },
            onBefore: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });

        setAccessDialog(true);
    };

    const deleteUser = () => {
        const message = "Êtes-vous sûr de vouloir supprimer cet utilisateur ?";
        if (!confirm(message)) return;

        const endpoint = route("manage.user.destroy", {
            user: row.original.uuid,
        });

        router.delete(endpoint, {
            preserveState: true,
        });
    };

    return (
        <>
            <DropdownMenu.DropdownMenu modal={false}>
                <DropdownMenu.DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenu.DropdownMenuTrigger>
                <DropdownMenu.DropdownMenuContent
                    align="end"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className="max-w-64"
                    loop
                >
                    <DropdownMenu.DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={() => {
                            navigator.clipboard.writeText(row.original.uuid);
                            toast.success("l'identifiant a été copié");
                        }}
                    >
                        <ClipboardCopy className="h-4 w-4 shrink-0 mr-2" />
                        Copier l'ID
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuSeparator />
                    <DropdownMenu.DropdownMenuItem onClick={openAffectation}>
                        <GitMerge className="h-4 w-4 shrink-0 mr-2" />
                        Gérer les affectation
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem onClick={openAccess}>
                        <Key className="h-4 w-4 shrink-0 mr-2" />
                        Gérer les roles et permissions
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem asChild>
                        <Link
                            href={route("manage.user.edit", row.original.uuid)}
                        >
                            <Pencil className="h-4 w-4 shrink-0 mr-2" />
                            Modifier
                        </Link>
                    </DropdownMenu.DropdownMenuItem>
                    <DropdownMenu.DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={deleteUser}
                    >
                        <Trash className="text-red-600 h-4 w-4 shrink-0 mr-2" />
                        Supprimé
                    </DropdownMenu.DropdownMenuItem>
                </DropdownMenu.DropdownMenuContent>
            </DropdownMenu.DropdownMenu>

            <Dialog.Dialog
                open={affectationDialog}
                onOpenChange={setAffectationDialog}
            >
                <Dialog.DialogContent
                    className="max-w-screen-lg h-full max-h-[80vh] flex flex-col gap-4"
                    onFocusOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Dialog.DialogHeader>
                        <Dialog.DialogTitle>
                            Gérer les affectations de division
                        </Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Mettez à jour les affectations de division de{" "}
                            <strong>{row.original.name}</strong>. Rechercher et
                            ajouter ou supprimer des divisions.
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <ManageAffectation
                        processing={processing}
                        user={row.original}
                        close={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.delete("uuid");
                            window.history.replaceState({}, "", url.toString());

                            setAffectationDialog(false);
                        }}
                    />
                </Dialog.DialogContent>
            </Dialog.Dialog>

            <Dialog.Dialog open={accessDialog} onOpenChange={setAccessDialog}>
                <Dialog.DialogContent
                    className="max-w-screen-lg h-full max-h-[80vh] flex flex-col gap-4"
                    onFocusOutside={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <Dialog.DialogHeader>
                        <Dialog.DialogTitle>
                            Gérer les roles et permissions
                        </Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Mettez à jour les roles et permissions de{" "}
                            <strong>{row.original.name}</strong>. Ajouter ou
                            supprimer des roles et des permissions.
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <ManageAccess
                        processing={processing}
                        user={row.original}
                        close={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.delete("uuid");
                            window.history.replaceState({}, "", url.toString());

                            setAccessDialog(false);
                        }}
                    />
                </Dialog.DialogContent>
            </Dialog.Dialog>
        </>
    );
};

interface DialogProps {
    user: User;
    processing: boolean;
    close: () => void;
}

const ManageAffectation: React.FC<DialogProps> = ({
    processing,
    close,
    user,
}) => {
    const [search, setSearch] = React.useState("");
    const { grades, userDivisions, unitsDivision } = usePage<{
        grades?: any[];
        userDivisions?: any[];
        unitsDivision?: any[];
    }>().props;

    const { data, setData, post, errors, recentlySuccessful } = useForm({
        divisions: [],
    });

    useUpdateEffect(() => {
        if (!data.divisions.length && userDivisions) {
            setData((data) => {
                data.divisions = [
                    ...userDivisions.map((div) => ({
                        division: div.id,
                        name: div.name,
                        abbr: div.abbr,
                        grade: div.grade.id,
                    })),
                    ...data.divisions,
                ];
                return { ...data };
            });
        }
    }, [userDivisions]);

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = route("manage.user.sync.divisions", {
            user: user.uuid,
        });

        post(endpoint, {
            preserveScroll: true,
            preserveState: true,
            only: ["userDivisions", "unitsDivision", "grades", "alert"],
        });
    };

    if (processing) {
        return (
            <div className="flex items-center">
                <LoaderCircle className="h-6 w-6 shrink-0 mr-2 animate-spin" />
                Chargement des divisions...
            </div>
        );
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="relative">
                <Command.Command loop autoFocus={false}>
                    <Command.CommandHeader className="border rounded-md">
                        <Command.CommandInput
                            autoFocus={false}
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Rechercher les divisions"
                        />
                    </Command.CommandHeader>

                    <Command.CommandList
                        className={cn(
                            !search.length ? "hidden" : "",
                            "bg-white dark:bg-gray-600 shadow-lg absolute top-full left-20 right-20 z-10 max-h-40"
                        )}
                        autoFocus={false}
                    >
                        <Command.CommandEmpty>
                            No result found.
                        </Command.CommandEmpty>

                        {unitsDivision &&
                            unitsDivision?.map((unit, idx) => (
                                <Command.CommandGroup
                                    key={idx}
                                    heading={unit?.name}
                                >
                                    {unit?.divisions?.map((division, idx) => (
                                        <Command.CommandItem
                                            key={idx}
                                            onSelect={() => {
                                                if (
                                                    data.divisions.find(
                                                        (d) =>
                                                            d.division ===
                                                            division.id
                                                    )
                                                ) {
                                                    toast.error(
                                                        "Vous avez déja sélectionner cet division"
                                                    );
                                                    return;
                                                }

                                                setData((data) => {
                                                    data.divisions.push({
                                                        division: division.id,
                                                        name: division.name,
                                                        abbr: division.abbr,
                                                        grade: "",
                                                    });
                                                    return {
                                                        ...data,
                                                    };
                                                });

                                                setSearch("");
                                            }}
                                        >
                                            {`${division?.name} -${division?.abbr}-`}
                                        </Command.CommandItem>
                                    ))}
                                </Command.CommandGroup>
                            ))}
                    </Command.CommandList>
                </Command.Command>
            </div>
            <div className="max-h-80 min-h-60 overflow-auto divide-y-2">
                {data.divisions.length
                    ? data.divisions.map((division, idx) => (
                          <div key={idx} className="p-2">
                              <div className=" flex items-center justify-between">
                                  <div>
                                      <span>{division?.name}</span>{" "}
                                      <span>-{division?.abbr}-</span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                      <Select.Select
                                          value={division.grade}
                                          onValueChange={(value) => {
                                              setData((data) => {
                                                  data.divisions[idx].grade =
                                                      value;
                                                  return { ...data };
                                              });
                                          }}
                                      >
                                          <Select.SelectTrigger className="w-full max-w-xs min-w-[20rem]">
                                              <Select.SelectValue placeholder="Sélectionner un grade" />
                                          </Select.SelectTrigger>
                                          <Select.SelectContent>
                                              {grades &&
                                                  grades.map((grade, idx) => (
                                                      <Select.SelectItem
                                                          key={idx}
                                                          value={String(
                                                              grade.id
                                                          )}
                                                      >
                                                          {grade.name}
                                                      </Select.SelectItem>
                                                  ))}
                                          </Select.SelectContent>
                                      </Select.Select>
                                      <Button
                                          type="button"
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => {
                                              setData((data) => {
                                                  data.divisions.splice(idx, 1);
                                                  return { ...data };
                                              });
                                          }}
                                      >
                                          <X className="h-4 w-4 shrink-0" />
                                      </Button>
                                  </div>
                              </div>
                              <InputError
                                  message={errors[`divisions.${idx}.grade`]}
                              />
                          </div>
                      ))
                    : userDivisions?.length == 0 && (
                          <>
                              <p className="pt-5 text-blue-600">
                                  Ce utilisateur n'est affecté à aucune division
                              </p>
                          </>
                      )}
            </div>
            <div className="flex justify-between gap-4 mt-4">
                {recentlySuccessful && (
                    <p className="text-green-600 dark:text-gray-500">
                        Divisions associées mis à jour avec succés
                    </p>
                )}

                <div className="ml-auto space-x-4">
                    <Button type="button" variant="outline" onClick={close}>
                        Fermer
                    </Button>
                    <Button variant="primary">Sauvegarder</Button>
                </div>
            </div>
        </form>
    );
};

const ManageAccess: React.FC<DialogProps> = ({ processing, user, close }) => {
    const { data, setData, post, recentlySuccessful } = useForm<
        Record<"permissions" | "roles", { id: string; name: string }[]>
    >({
        permissions: [],
        roles: [],
    });

    const { userAccess, permissions, roles } = usePage<{
        userAccess?: {
            roles: { id: string; name: string }[];
            permissions: { id: string; name: string }[];
        };
        permissions: { id: string; name: string }[];
        roles: { id: string; name: string }[];
    }>().props;

    const { userRoles, userPermissions } = React.useMemo(
        () => ({
            userRoles: userAccess?.roles,
            userPermissions: userAccess?.permissions,
        }),
        [userAccess]
    );

    useUpdateEffect(() => {
        if (
            !data.permissions.length &&
            !data.roles.length &&
            userRoles &&
            userPermissions
        ) {
            setData((data) => {
                data.permissions = userPermissions.map((p) => ({
                    id: p.id,
                    name: p.name,
                }));
                data.roles = userRoles.map((r) => ({ id: r.id, name: r.name }));

                return { ...data };
            });
        }
    }, [userRoles, userPermissions]);

    const loadPermissions = () => {
        if (permissions) return;

        router.reload({
            only: ["permissions"],
        });
    };

    const loadRoles = () => {
        if (roles) return;

        router.reload({
            only: ["roles"],
        });
    };

    const selectPermission = (id: string) => {
        if (data.permissions.find((p) => p.id == id)) {
            toast.error("Cet utilisateur a déja cet permission");
            return;
        }

        setData((data) => {
            data.permissions.push({
                id,
                name: permissions?.find((p) => p.id === id)?.name!,
            });
            return { ...data };
        });
    };

    const selectRole = (id: string) => {
        if (data.roles.find((r) => r.id == id)) {
            toast.error("Cet utilisateur a déjà ce rôle");
            return;
        }

        setData((data) => {
            data.roles.push({
                id,
                name: roles?.find((r) => r.id === id)?.name!,
            });
            return { ...data };
        });
    };

    const removePermission = (id: string) => {
        setData((data) => {
            data.permissions.splice(
                data.permissions.findIndex((p) => p.id == id),
                1
            );
            return { ...data };
        });
    };

    const removeRole = (id: string) => {
        setData((data) => {
            data.roles.splice(
                data.roles.findIndex((r) => r.id === id),
                1
            );
            return { ...data };
        });
    };

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();

        const endpoint = route("manage.user.sync.access", {
            user: user.uuid,
        });

        post(endpoint, {
            preserveState: true,
        });
    };

    if (processing) {
        return <>Loading...</>;
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="space-x-2">
                <Popover.Popover>
                    <Popover.PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-between pr-0"
                            onClick={loadRoles}
                        >
                            Ajouter des roles
                            <div
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                <ChevronDown className="shrink-0 h-4 w-4" />
                            </div>
                        </Button>
                    </Popover.PopoverTrigger>
                    <Popover.PopoverContent className="p-0">
                        <Command.Command loop>
                            <Command.CommandHeader>
                                <Command.CommandInput placeholder="Rechercher les roles" />
                            </Command.CommandHeader>
                            <Command.CommandList>
                                <Command.CommandGroup>
                                    {roles ? (
                                        <>
                                            <Command.CommandEmpty>
                                                Aucun résultat trouvé
                                            </Command.CommandEmpty>
                                            {roles &&
                                                roles?.map((role, idx) => (
                                                    <Command.CommandItem
                                                        key={idx}
                                                        value={role.id}
                                                        onSelect={selectRole}
                                                        disabled={
                                                            !!data.roles.find(
                                                                (r) =>
                                                                    r.id ==
                                                                    role.id
                                                            )
                                                        }
                                                    >
                                                        {role.name}
                                                    </Command.CommandItem>
                                                ))}
                                        </>
                                    ) : (
                                        <Command.CommandLoading className="flex items-center justify-center">
                                            <LoaderCircle className="h-4 w-4 shrink-0 mr-2 animate-spin" />
                                            Chargement des roles...
                                        </Command.CommandLoading>
                                    )}
                                </Command.CommandGroup>
                            </Command.CommandList>
                        </Command.Command>
                    </Popover.PopoverContent>
                </Popover.Popover>

                <Popover.Popover>
                    <Popover.PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="justify-between pr-0"
                            onClick={loadPermissions}
                        >
                            Ajouter des permissions
                            <div
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                <ChevronDown className="shrink-0 h-4 w-4" />
                            </div>
                        </Button>
                    </Popover.PopoverTrigger>
                    <Popover.PopoverContent className="p-0">
                        <Command.Command loop>
                            <Command.CommandHeader>
                                <Command.CommandInput placeholder="Rechercher les permissions" />
                            </Command.CommandHeader>
                            <Command.CommandList>
                                <Command.CommandGroup>
                                    <Command.CommandEmpty>
                                        Aucun résultat trouvé
                                    </Command.CommandEmpty>
                                    {permissions &&
                                        permissions?.map((permission, idx) => (
                                            <Command.CommandItem
                                                key={idx}
                                                onSelect={selectPermission}
                                                value={permission.id}
                                                disabled={
                                                    !!data.permissions.find(
                                                        (p) =>
                                                            p.id ==
                                                            permission.id
                                                    )
                                                }
                                            >
                                                {permission.name}
                                            </Command.CommandItem>
                                        ))}
                                </Command.CommandGroup>
                            </Command.CommandList>
                        </Command.Command>
                    </Popover.PopoverContent>
                </Popover.Popover>
            </div>

            <div className="max-h-80 min-h-60 overflow-auto space-y-4 mt-4">
                <div className="space-y-2">
                    <Heading level={5}>Roles</Heading>
                    <ul className="flex items-center flex-wrap gap-4">
                        {data.roles?.map((role, idx) => (
                            <li key={idx}>
                                <Badge
                                    className="capitalize inline-flex items-center cursor-pointer select-none"
                                    size="default"
                                    variant="indigo"
                                    onClick={() => removeRole(role.id)}
                                >
                                    {role.name}
                                    <Trash className="shrink-0 h-4 w-4 ml-1" />
                                </Badge>
                            </li>
                        ))}

                        {userRoles?.length === 0 && data.roles.length === 0 && (
                            <li className="text-blue-500">
                                Cet utilisateur n'a aucun role
                            </li>
                        )}
                    </ul>
                </div>
                <div className="space-y-2">
                    <Heading level={5}>Permissions</Heading>
                    <ul className="flex items-center flex-wrap gap-4">
                        {data.permissions?.map((permission, idx) => (
                            <li key={idx}>
                                <Badge
                                    className="capitalize inline-flex items-center cursor-pointer select-none"
                                    size="default"
                                    variant="indigo"
                                    onClick={() =>
                                        removePermission(permission.id)
                                    }
                                >
                                    {permission.name}
                                    <Trash className="shrink-0 h-4 w-4 ml-2" />
                                </Badge>
                            </li>
                        ))}

                        {userPermissions?.length === 0 &&
                            data.permissions.length === 0 && (
                                <li className="text-blue-500">
                                    Cet utilisateur n'a aucune permissions
                                    directe
                                </li>
                            )}
                    </ul>
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
                <Button type="button" variant="outline" onClick={close}>
                    Fermer
                </Button>
                <Button variant="primary">Sauvegarder</Button>
            </div>
        </form>
    );
};
