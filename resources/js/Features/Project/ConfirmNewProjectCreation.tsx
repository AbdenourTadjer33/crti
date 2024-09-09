import React from "react";
import { router, Link } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/Services/api/projects";
import { useMediaQuery } from "@/Hooks/use-media-query";
import { Plus, MoveRight, LoaderCircle } from "lucide-react";
import { Button, buttonVariants } from "@/Components/ui/button";
import * as Dialog from "@/Components/ui/dialog";
import * as Drawer from "@/Components/ui/drawer";
import * as Select from "@/Components/ui/select";
import { Progress } from "@/Components/ui/infinate-progress";
import { Text } from "@/Components/ui/paragraph";
import { cn } from "@/Utils/utils";
import { Skeleton } from "@/Components/ui/skeleton";
import { InputError } from "@/Components/ui/input-error";

const ConfirmNewProjectCreation: React.FC<{
    onTriggerPressed: () => void;
    divisions?: [];
}> = ({ onTriggerPressed, divisions }) => {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [division, setDivision] = React.useState<string>("");
    const { mutate, reset, isPending, isError, isSuccess, error, data } =
        useMutation({
            mutationFn: async (data) => {
                return createProject(data);
            },
            onSuccess: () => router.reload({ only: ["projectsInCreation"] }),
        });

    if (isDesktop) {
        return (
            <Dialog.Dialog open={open} onOpenChange={setOpen} modal={true}>
                <Dialog.DialogTrigger onClick={onTriggerPressed} asChild>
                    <div className="select-none cursor-pointer duration-150 hover:border-primary-700 hover:border-solid hover:bg-white hover:text-primary-700 group w-full h-full flex flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 text-sm leading-6 font-medium">
                        <Plus className="h-10 w-10 group-hover:text-primary-700" />
                        Ajouter un nouveau projet
                    </div>
                </Dialog.DialogTrigger>
                <Dialog.DialogContent
                    className="mx-auto max-w-xl grid gap-4 rounded relative overflow-hidden"
                    classNames={{
                        overlay: "bg-black/25",
                    }}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onEscapeKeyDown={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                >
                    <Dialog.DialogHeader className="space-y-4">
                        <Dialog.DialogTitle className="text-xl font-medium">
                            Confirmer la création du projet
                        </Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Êtes-vous sûr de vouloir créer un nouveau projet ?
                            Cliquez sur « Créer » pour initialiser un nouveau
                            projet et passer à la page du formulaire, ou «
                            Annuler » pour fermer cette boîte de dialogue.
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <div className="space-y-4">
                        <CreateNewProject
                            {...{
                                divisions,
                                division,
                                setDivision,
                                isPending,
                                isError,
                                isSuccess,
                                data,
                                error,
                                reset,
                                onCancel: () => setOpen(false),
                                onCreate: () => mutate({ division }),
                            }}
                        />
                    </div>
                </Dialog.DialogContent>
            </Dialog.Dialog>
        );
    }

    return (
        <Drawer.Drawer open={open} onOpenChange={setOpen}>
            <Drawer.DrawerTrigger onClick={onTriggerPressed} asChild>
                <div className="relative group select-none bg-white rounded shadow hover:bg-gray-50 border hover:border-gray-300 h-full flex flex-col items-center justify-center cursor-pointer">
                    <Plus className="h-10 w-10 text-primary-700" />
                    <span className="absolute bottom-2 text-primary-700 invisible group-hover:visible group-hover:animate-in group-hover:fade-in animate-out fade-out duration-200">
                        Ajouter un nouveau projet
                    </span>
                </div>
            </Drawer.DrawerTrigger>
            <Drawer.DrawerContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                className="overflow-hidden"
            >
                <Drawer.DrawerHeader className="text-left">
                    <Drawer.DrawerTitle>
                        Confirmer la création du projet
                    </Drawer.DrawerTitle>
                    <Drawer.DrawerDescription>
                        Êtes-vous sûr de vouloir créer un nouveau projet ?
                        Cliquez sur « Créer » pour initialiser un nouveau projet
                        et passer à la page du formulaire, ou « Annuler » pour
                        fermer cette boîte de dialogue.
                    </Drawer.DrawerDescription>
                </Drawer.DrawerHeader>
                <div className="px-4 mb-4 space-y-4">
                    <CreateNewProject
                        {...{
                            divisions,
                            division,
                            setDivision,
                            isPending,
                            isError,
                            isSuccess,
                            data,
                            error,
                            reset,
                            onCancel: () => setOpen(false),
                            onCreate: () => mutate({ division }),
                        }}
                    />
                </div>
            </Drawer.DrawerContent>
        </Drawer.Drawer>
    );
};

interface CreateNewProjectProps {
    divisions?: [];
    division?: string;
    setDivision: React.Dispatch<React.SetStateAction<string>>;
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: any;
    data: any;
    onCreate: () => void;
    onCancel: () => void;
    reset: () => void;
}

const CreateNewProject: React.FC<CreateNewProjectProps> = ({
    divisions,
    division,
    setDivision,
    isPending,
    isError,
    isSuccess,
    data,
    error,
    onCreate,
    onCancel,
    reset,
}) => {
    const closeAndResetFn = () => {
        onCancel();
        setTimeout(() => {
            reset();
        }, 200);
    };

    if (isError && error?.response.status !== 422) {
        return (
            <>
                <Text className="text-red-500">
                    Une erreur est sourvenu lors de création de projet.
                </Text>

                <Button variant="outline" className="w-full" onClick={closeAndResetFn}>
                    réessayez plus tard
                </Button>
            </>
        );
    }

    if (isSuccess) {
        return (
            <>
                <Text className="text-green-600">
                    Projet créer avec succés.
                </Text>

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4 sm:mx-auto">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={closeAndResetFn}
                    >
                        Fermer
                    </Button>
                    <Link
                        href={route("project.version.create", data.code)}
                        className={cn(buttonVariants({}), "w-full")}
                    >
                        Poursuivre la création
                    </Link>
                </div>
            </>
        );
    }

    return (
        <>
            <div
                className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-50 hidden data-[pending=true]:block"
                data-pending={isPending}
            >
                <Progress className="bg-indigo-600" />
            </div>
            <div className="grid">
                <div className="space-y-1">
                    {divisions ? (
                        <>
                            <Select.Select
                                disabled={isPending}
                                value={division}
                                onValueChange={(value) => setDivision(value)}
                            >
                                <Select.SelectTrigger>
                                    <Select.SelectValue placeholder="Sélectionner une division" />
                                </Select.SelectTrigger>
                                <Select.SelectContent>
                                    {divisions.map((division, idx) => (
                                        <Select.SelectItem
                                            key={idx}
                                            value={division.id}
                                        >
                                            {division.name}
                                        </Select.SelectItem>
                                    ))}
                                </Select.SelectContent>
                            </Select.Select>
                            <InputError
                                message={error?.response.data.message}
                            />
                        </>
                    ) : (
                        <Skeleton className="w-full h-10 bg-gray-200" />
                    )}
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4 sm:mx-auto">
                <Button
                    variant="destructive"
                    className="w-full"
                    onClick={closeAndResetFn}
                    disabled={isPending}
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    className="w-full items-center"
                    onClick={onCreate}
                    disabled={isPending}
                >
                    {isPending ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                            Création de projet...
                        </>
                    ) : (
                        <>
                            Créer le projet
                            <MoveRight className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

export default ConfirmNewProjectCreation;
