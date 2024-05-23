import * as React from "react";
import { Input, InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { CreateUnitContext, InfrastructureForm } from "./CreateForm";
import { Button } from "@/Components/ui/button";
import { Textarea } from "@/Components/ui/textarea";

const UnitInfrastructureForm = () => {
    const { data, setData, errors } = React.useContext(CreateUnitContext);

    function newRecord() {
        setData((data) => {
            data.infrastructures.push({ name: "", description: "", state: "" });
            return { ...data };
        });
    }

    function canAddNewRecord(): boolean {
        for (const record of data.infrastructures) {
            if (!record.valid) {
                return false;
            }
        }
        return true;
    }

    React.useEffect(() => {
        if (!data.infrastructures.length) {
            newRecord();
        }
    }, []);

    return (
        <div className="space-y-2">
            {data.infrastructures.map((infrastructure, idx) =>
                !infrastructure.valid ? (
                    <InfrastructureInformationForm
                        key={idx}
                        {...{ idx, infrastructure }}
                    />
                ) : (
                    <InfrastructureWidget
                        key={idx}
                        {...{ idx, infrastructure }}
                    />
                )
            )}

            {canAddNewRecord() && (
                <Button
                    type="button"
                    variant="link"
                    className="col-span-3"
                    onClick={newRecord}
                >
                    Ajouter de nouveux material
                </Button>
            )}
        </div>
    );
};

const InfrastructureInformationForm = ({
    infrastructure,
    idx,
}: {
    infrastructure: InfrastructureForm;
    idx: number;
}) => {
    const { setData, errors } = React.useContext(CreateUnitContext);

    function cancelRecord() {
        setData((data) => {
            data.infrastructures.splice(idx, 1);
            return { ...data };
        });
    }

    function validateRecord() {
        if (!infrastructure.name || !infrastructure.state) return;
        setData((data) => {
            data.infrastructures[idx].valid = true;
            return { ...data };
        });
    }

    return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border dark:border-gray-500 grid grid-cols-2 gap-4">
            <div className="space-y-1">
                <Label>Nature</Label>
                <Input
                    value={infrastructure.name}
                    onChange={(e) =>
                        setData((data) => {
                            data.infrastructures[idx].name = e.target.value;
                            return { ...data };
                        })
                    }
                />
                <InputError message={errors[`infrastructures.${idx}.name`]} />
            </div>
            <div className="space-y-1">
                <Label>Etat</Label>
                <Input
                    value={infrastructure.state}
                    onChange={(e) =>
                        setData((data) => {
                            data.infrastructures[idx].state = e.target.value;
                            return { ...data };
                        })
                    }
                />
            </div>
            <div className="space-y-1 col-span-2">
                <Label>Description</Label>
                <Textarea
                    value={infrastructure.description}
                    onChange={(e) =>
                        setData((data) => {
                            data.infrastructures[idx].description =
                                e.target.value;
                            return { ...data };
                        })
                    }
                />
            </div>
            <div className="col-span-2 flex items-center gap-4">
                <Button
                    variant="destructive"
                    onClick={cancelRecord}
                    className="w-full"
                >
                    Annuler
                </Button>
                <Button
                    variant="primary"
                    onClick={validateRecord}
                    className="w-full"
                >
                    Ajouter
                </Button>
            </div>
        </div>
    );
};

const InfrastructureWidget = ({
    infrastructure,
    idx,
}: {
    infrastructure: InfrastructureForm;
    idx: number;
}) => {
    const { setData } = React.useContext(CreateUnitContext);

    function invalidate() {
        setData((data) => {
            delete data.infrastructures[idx].valid;
            return { ...data };
        });
    }

    return (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded border dark:border-gray-500 flex justify-between">
            <ul>
                <li>{infrastructure.name}</li>
                <li>{infrastructure.description}</li>
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

export default UnitInfrastructureForm;
