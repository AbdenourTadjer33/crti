import React from "react";
import { Link, router } from "@inertiajs/react";
import { useMediaQuery } from "@/Hooks/use-media-query";
import { Button, buttonVariants } from "@/Components/ui/button";
import * as Dialog from "@/Components/ui/dialog";
import * as Drawer from "@/Components/ui/drawer";
import { Progress } from "@/Components/ui/infinate-progress";
import { LoaderCircle, MoveRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { duplicateProjectVersion } from "@/Services/api/projects";
import { InputError } from "@/Components/ui/input-error";
import { Text } from "@/Components/ui/paragraph";
import { cn } from "@/Utils/utils";
import { Textarea } from "@/Components/ui/textarea";

const MAX_REASON = 300;

interface Props {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ConfirmNewVersionCreation: React.FC<Props> = ({ open, setOpen }) => {
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [reason, setReason] = React.useState<string>("");
    const { mutate, reset, isPending, isError, isSuccess, error, data } =
        useMutation({
            mutationFn: async (data) => {
                const projectId = route().params.project as string;
                return duplicateProjectVersion(projectId, data);
            },
            onSuccess: () => router.reload({ only: ["versionInCreation"] }),
        });

    if (isDesktop) {
        return (
            <Dialog.Dialog open={open} onOpenChange={setOpen}>
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
                    <div
                        className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-50 hidden data-[pending=true]:block"
                        data-pending={isPending}
                    >
                        <Progress className="bg-indigo-600" />
                    </div>
                    <Dialog.DialogHeader className="space-y-4">
                        <Dialog.DialogTitle className="text-xl font-medium">
                            Are you sure that you want edit this project
                        </Dialog.DialogTitle>
                        <Dialog.DialogDescription>
                            Please confirm your action to edit this project by
                            providing a reason for the changes. This information
                            will help us understand the context of the
                            modifications. Once confirmed, you will be
                            redirected to the project edit form.
                        </Dialog.DialogDescription>
                    </Dialog.DialogHeader>
                    <div className="space-y-4">
                        <CreateNewVersion
                            {...{
                                reason,
                                setReason,
                                isPending,
                                isError,
                                isSuccess,
                                data,
                                error,
                                reset,
                                onCreate: () => mutate({ reason }),
                                onCancel: () => {
                                    setOpen(false);
                                    setReason("");
                                },
                            }}
                        />
                    </div>
                </Dialog.DialogContent>
            </Dialog.Dialog>
        );
    }

    return (
        <Drawer.Drawer open={open} onOpenChange={setOpen}>
            <Drawer.DrawerContent
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                onPointerDownOutside={(e) => e.preventDefault()}
                className="overflow-hidden"
            >
                <div
                    className="absolute top-0 left-0 right-0 h-1 bg-indigo-50 hidden data-[pending=true]:block"
                    data-pending={isPending}
                >
                    <Progress className="bg-indigo-600" />
                </div>
                <Drawer.DrawerHeader className="text-left">
                    <Drawer.DrawerTitle>
                        Are you sure that you want edit this project
                    </Drawer.DrawerTitle>
                    <Drawer.DrawerDescription>
                        Please confirm your action to edit this project by
                        providing a reason for the changes. This information
                        will help us understand the context of the
                        modifications. Once confirmed, you will be redirected to
                        the project edit form.
                    </Drawer.DrawerDescription>
                </Drawer.DrawerHeader>
                <div className="px-4 mb-4 space-y-4">
                    <CreateNewVersion
                        {...{
                            reason,
                            setReason,
                            isPending,
                            isError,
                            isSuccess,
                            data,
                            error,
                            reset,
                            onCreate: () => mutate({ reason }),
                            onCancel: () => {
                                setOpen(false);
                                setReason("");
                            },
                        }}
                    />
                </div>
            </Drawer.DrawerContent>
        </Drawer.Drawer>
    );
};

interface CreateNewVersionProps {
    reason: string;
    setReason: React.Dispatch<React.SetStateAction<string>>;
    isPending: boolean;
    isError: boolean;
    isSuccess: boolean;
    error: any;
    data: any;
    onCreate: () => void;
    onCancel: () => void;
    reset: () => void;
}

const CreateNewVersion: React.FC<CreateNewVersionProps> = ({
    reason,
    setReason,
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

    const updateReason = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e.target;
        if (value.length <= MAX_REASON) setReason(value);
    };

    if (isError && error.response.status === 409) {
        return (
            <>
                <Text className="text-red-500">
                    {error.response.data.message}
                </Text>

                <Button variant="outline" className="w-full" onClick={closeAndResetFn}>
                    Fermer
                </Button>
            </>
        );
    }

    if (isError && error?.response.status !== 422)
        return (
            <>
                <Text className="text-red-500">
                    Une erreur s'est produite lors de le creation de la nouvelle
                    version
                </Text>

                <Button variant="outline" className="w-full" onClick={closeAndResetFn}>
                    réessayez plus tard
                </Button>
            </>
        );

    if (isSuccess)
        return (
            <>
                <Text className="text-green-600">
                    Version créer avec succés
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
                        href={route("project.version.edit", {
                            project: data.project,
                            version: data.version,
                        })}
                        className={cn(buttonVariants({}), "w-full")}
                    >
                        Poursuivre la modification
                    </Link>
                </div>
            </>
        );

    return (
        <>
            <div>
                <div className="relative">
                    <Textarea
                        value={reason}
                        onChange={updateReason}
                        placeholder="Raison de la nouvelle version"
                        className="min-h-32 max-h-60"
                    />
                    <div className="absolute bottom-1.5 right-2.5">
                        <span>{reason.length}</span>/<span>{MAX_REASON}</span>
                    </div>
                </div>
                <InputError
                    className="ms-1 mt-0.5"
                    message={error?.response.data.message}
                />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-4 sm:mx-auto">
                <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isPending}
                    onClick={closeAndResetFn}
                >
                    Annuler
                    <div
                        className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-50 hidden data-[pending=true]:block"
                        data-pending={isPending}
                    >
                        <Progress className="bg-indigo-600" />
                    </div>
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
                            Initialization de la version
                        </>
                    ) : (
                        <>
                            Modifier
                            <MoveRight className="h-4 w-4 ml-2" />
                        </>
                    )}
                </Button>
            </div>
        </>
    );
};

export default ConfirmNewVersionCreation;
