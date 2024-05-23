import * as React from "react";
import { CreateProjectContext } from "./CreateProject";
import { Heading } from "@/Components/ui/heading";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TableWraper } from "@/Components/ui/table";
import { Pagination, User } from "@/types";



const Canvas = () => {
    // const { data, setData, errors } = React.useContext(CreateProjectContext);



    return (
        <div className="md:grid grid-cols-3 gap-4">
            <div className=" col-span-3 justify-center">
                <Heading level={4}>Projet de Développement Technologique</Heading>
            </div>
            <div className=" col-span-3 justify-center">
                <Heading level={5}>Identification du projet</Heading>
                <div>
                    <TableWraper>
                        <Table>
                            <TableCaption>table</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead></TableHead>
                                    <TableHead></TableHead>
                                    <TableHead></TableHead>
                                    <TableHead></TableHead>
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
            </div>

        </div>
    )
}
export default Canvas;


