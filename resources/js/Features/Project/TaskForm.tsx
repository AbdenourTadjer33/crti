import { Heading } from "@/Components/ui/heading";
import { CreateProjectContext } from "./CreateProject";
import { Label } from "@/Components/ui/label";
import { Input, InputError } from "@/Components/ui/input";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Calendar } from "@/Components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";


const TaskForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);

    return (
        <div className="md:grid grid-cols-3 gap-4">
            <div className="col-span-3">
                <Heading level={4}>Organisation des travaux</Heading>
            </div>
            {/* NAME  */}
            <div className="space-y-1">
                <Label>Intitulé de la tache</Label>
                <Input
                />
                <InputError />
            </div>
            {/* BEGIN  */}
            <div className="space-y-1 row-span-2">
                <Label>Date de debut</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Input
                            // readOnly
                            // value={
                            //     startDate ? format(startDate, "dd/MM/yyyy") : ""
                            // }
                            placeholder="sélectionner une date"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar />
                    </PopoverContent>
                </Popover>
            </div>
            {/* END  */}
            <div className="space-y-1 row-span-2">
                <Label>Date de fin</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Input
                            // readOnly
                            // value={endDate ? format(endDate, "dd/mm/yyyy") : ""}
                            // placeholder="sélectionner une date"
                        />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Calendar />
                    </PopoverContent>
                </Popover>
            </div>
            {/* INDICATEUR  */}
            <div className="space-y-1">
                <Label>Indicateur</Label>
                <Select>
                    <SelectTrigger>

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
            {/* description */}
            <div className="space-y-1 col-span-3 ">
                <Label htmlFor="desctiption">Description</Label>
                <Textarea
                />
            </div>
        </div>
    )
}

export default TaskForm;






