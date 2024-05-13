import React from "react";
import { CreateUnitContext } from "../CreateForm";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";

const CreateDivision: React.FC = () => {
    const { data, setData } = React.useContext(CreateUnitContext);

    const addDivision = () => {
        setData((prev) => {
            prev.divisions?.push({
                name: "",
                description: "",
            });
            return { ...prev };
        });
    };

    React.useEffect(() => {
        if (data.divisions.length === 0) {
            addDivision();
        }
    }, []);

    return (
        <React.Fragment>
            <Heading level={4} className="font-medium flex items-center gap-2">
                Ajouter les divisions de l'unité
                <Button type="button" onClick={addDivision}>
                    Add division
                </Button>
            </Heading>
            {data.divisions.map((division, idx) => (
                <div
                    key={idx}
                    className="bg-red-200 p-4 my-2 rounded shadow space-y-4"
                >
                    <div>
                        <Label>Division</Label>
                        <Input
                            value={division.name}
                            onChange={(e) => {
                                setData((prev) => {
                                    prev.divisions[idx].name = e.target.value;
                                    return { ...prev };
                                });
                            }}
                        />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea
                            value={division.description}
                            onChange={(e) => {
                                setData((prev) => {
                                    prev.divisions[idx].description =
                                        e.target.value;
                                    return { ...prev };
                                });
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button className="w-full" variant="destructive">
                            Annuler
                        </Button>
                        <Button className="w-full" variant="primary">
                            Validé
                        </Button>
                    </div>
                </div>
            ))}
        </React.Fragment>
    );
};

export { CreateDivision };
