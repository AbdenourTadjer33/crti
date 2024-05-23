import React from "react";
import { CreateProjectContext } from "./CreateProject";
import { Heading } from "@/Components/ui/heading";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/Components/ui/select";
import { Input, InputError } from "@/Components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TableWraper } from "@/Components/ui/table";


const MaterialForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);


    // const [material, setMaterial] = useState([0]);

    // const addMaterial = () => {
    //     setMaterial([...material, material.length]);
    // };

    // const removeMaterial = (index) => {
    //     setMaterial(material.filter((_, idx) => idx !== index));
    // };

    return (
        <div className=" space-y-10">
            {/* Materiel crti  */}
            <div className="md:grid grid-cols-3 gap-4">
                <div className=" col-span-3">
                    <Heading level={5}>Matériel existant pouvant être utilisé dans l’exécution du projet </Heading>
                </div>
                <div className=" space-y-1 col-span-3">
                    <TableWraper>
                        <Table>
                            <TableCaption>table</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nature</TableHead>
                                    <TableHead>Localisation</TableHead>
                                    <TableHead>Etat</TableHead>
                                    <TableHead>Observation</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableWraper>
                </div>
                <div className="space-y-1">
                    <Select>
                        <SelectTrigger>
                            selectionner un materiel
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
            </div>
            {/* matiere crti  */}
            <div className="md:grid grid-cols-3 gap-4">
                <div className=" col-span-3">
                    <Heading level={5}>Matière première, composants et petits équipements à acquérir par le CRTI</Heading>
                </div>
                <div className=" col-span-3">
                    <TableWraper>
                        <Table>
                            <TableCaption></TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nature</TableHead>
                                    <TableHead>Observation</TableHead>
                                    <TableHead>Montant (da)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}>Montant total</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableWraper>
                </div>
                <div className="space-y-1">
                    <Label>Nature</Label>
                    <Input
                    />
                    <InputError />
                </div>
                <div className="space-y-1">
                    <Label>Observation</Label>
                    <Input
                    />
                    <InputError />
                </div>
                <div className="space-y-1">
                    <Label>Monrant (DA)</Label>
                    <Input
                        type="number"
                    />
                    <InputError />
                </div>
            </div>
            {/* matiere partenair  */}
            <div className="md:grid grid-cols-3 gap-4">
                <div className=" col-span-3">
                    <Heading level={5}>Matière première, composants et petits équipements à acquérir par le partenaire socio-économique</Heading>
                </div>
                <div className=" col-span-3">
                    <TableWraper>
                        <Table>
                            <TableCaption></TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nature</TableHead>
                                    <TableHead>Observation</TableHead>
                                    <TableHead>Montant (da)</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>

                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={4}>Montant total</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableWraper>
                </div>
                <div className="space-y-1">
                    <Label>Nature</Label>
                    <Input
                    />
                    <InputError />
                </div>
                <div className="space-y-1">
                    <Label>Observation</Label>
                    <Input
                    />
                    <InputError />
                </div>
                <div className="space-y-1">
                    <Label>Monrant (DA)</Label>
                    <Input
                        type="number"
                    />
                    <InputError />
                </div>
            </div>
        </div>

    );
}

export default MaterialForm;






