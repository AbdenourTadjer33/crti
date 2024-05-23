import React from "react";
import { Button } from "@/Components/ui/button";
import { Input, InputError } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select } from "@/Components/ui/select";
import { SelectTrigger } from "@/Components/ui/select";
import { SelectContent } from "@/Components/ui/select";
import { SelectItem } from "@/Components/ui/select";
import { Popover } from "@/Components/ui/popover";
import { PopoverTrigger } from "@/Components/ui/popover";
import { PopoverContent } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Textarea } from "@/Components/ui/textarea";
import { format } from "date-fns";
import { Heading } from "@/Components/ui/heading";
import { CreateProjectContext } from "./CreateProject";
import { Checkbox } from "@/Components/ui/checkbox";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandShortcut } from "@/Components/ui/command";
import { Combobox } from "@/Components/ui/combobox";
import { fr } from "date-fns/locale";



const Identification = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);


    const [projectDomaine, setProjectDomaine] = React.useState("");
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");


    return (
        <div className="md:grid grid-cols-3 gap-4">
            <div className="col-span-3">
                <Heading level={4}>Identification du projet</Heading>
            </div>
            {/* project name  */}
            <div className="space-y-1">
                <Label>Intitulé du projet</Label>
                <Input
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                />
                <InputError message={errors.name} />
            </div>
            {/* nature */}
            <div className="space-y-1">
                <Label>Nature du projet</Label>
                <Select onValueChange={(value) => setData("nature", value)}>
                    <SelectTrigger>
                        {data.nature || "selectionner la nature du projet"}
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="research">Recherche</SelectItem>
                        <SelectItem value="development">
                            developpement
                        </SelectItem>
                        <SelectItem value="innovation">innovation</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* domaine  */}
            <div className="space-y-1">
                <Label>Domaine d'application</Label>
                <Select onValueChange={(value) => setData("domaine", value)}>
                    <SelectTrigger>
                        <span>
                            {projectDomaine ||
                                "selectionner le domaine d'application"}
                        </span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="value1">value1</SelectItem>
                        <SelectItem value="value2">value2</SelectItem>
                        <SelectItem value="value3">value3</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* start date  */}
            <div className="space-y-1">
                <Label>Date de debut</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Input
                            readOnly
                            value={
                                startDate ? format(startDate, "dd/MM/yyyy") : undefined
                            }
                            placeholder="sélectionner une date"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar
                           
                        />
                    </PopoverContent>
                </Popover>
            </div>
            {/* end date  */}
            <div className="space-y-1">
                <Label>Date de fin</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Input
                            readOnly
                            value={endDate ? format(endDate, "dd/mm/yyyy") : ""}
                            placeholder="sélectionner une date"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar />
                    </PopoverContent>
                </Popover>
            </div>
            {/* description  */}
            <div className="space-y-1 col-span-3">
                <Label htmlFor="desctiption">Description succincte du projet</Label>
                <Textarea
                    value={data.description}
                    onChange={(e) => setData("description", e.target.value)}
                />
            </div>
            {/* objectif  */}
            <div className="space-y-1 col-span-3">
                <Label>Objectifs du projet</Label>
                <Textarea
                    value={data.objectif}
                    onChange={(e) => setData("objectif", e.target.value)}
                />
            </div>
            {/* methodologie  */}
            <div className="space-y-1 col-span-3">
                <Label>Méthodologies pour la mise en œuvre du projet</Label>
                <Textarea
                    value={data.methodologie}
                    onChange={(e) => setData("methodologie", e.target.value)}
                />
            </div>
            {/* partner checkbox  */}
            <Label className="col-span-3 inline-flex gap-2">
                <Checkbox
                    defaultChecked={data.isPartner}
                    onCheckedChange={(checked) =>
                        setData("isPartner", !!checked)
                    }
                />
                Ajouter le partenaire socio-econimique
            </Label>
            {/* partner name  */}
            {data.isPartner && (
                <div className="space-y-1 col-span-3">
                    <Label>Nom du Partenair socio-economique</Label>
                    <Input
                        value={data.partner}
                        onChange={(e) => setData("partner", e.target.value)}
                    />
                </div>
            )}
        </div>
    );
};

export default Identification;
