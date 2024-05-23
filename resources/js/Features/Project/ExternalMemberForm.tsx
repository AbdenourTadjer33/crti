import { Button } from "@/Components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import React from "react"
import { CreateProjectContext } from "./CreateProject"

export const ExternalMemberForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);


    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                    >
                        Ajouter un membre externe
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>ajouter un membre externe</DialogTitle>
                        <DialogDescription>
                            dsfsdf
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <div>
                            <Label>Nom et prenom</Label>
                            <Input
                                
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <Label>Structure de rattachement</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>Organisme</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>grade</Label>
                            <Input />
                        </div>
                        <div>
                            <Label>Diplome et domaine</Label>
                            <Input />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                        >save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}





