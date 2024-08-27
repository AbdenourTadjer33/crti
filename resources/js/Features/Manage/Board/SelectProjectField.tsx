import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface Project {
    code: string;
    name: string;
}

interface SelectProjectProps {
    projects: Project[];
    initialSelectedProject?: string;
    onProjectChange?: (projectCode: string | null) => void;
    error?: string;
}

const SelectProjectField: React.FC<SelectProjectProps> = ({
    projects,
    initialSelectedProject,
    onProjectChange,
    error,
}) => {
    const [selectedProjectCode, setSelectedProjectCode] = useState<string | null>(initialSelectedProject || null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (initialSelectedProject) {
            setSelectedProjectCode(initialSelectedProject);
        } else {
            setSelectedProjectCode(null);
        }
    }, [initialSelectedProject]);

    const handleProjectSelect = (project: Project) => {
        const newSelectedProjectCode = selectedProjectCode === project.code ? null : project.code;
        setSelectedProjectCode(newSelectedProjectCode);
        if (onProjectChange) {
            onProjectChange(newSelectedProjectCode);
        }
        setIsOpen(false);
    };

    // Trouver le projet sélectionné
    const selectedProject = projects.find(p => p.code === selectedProjectCode);

    return (
        <>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="flex items-center justify-between w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {selectedProject ? selectedProject.name : "Sélectionner un projet"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80">
                    <Command>
                        <CommandInput placeholder="Rechercher un projet..." />
                        <CommandEmpty>
                            Aucun projet avec ce nom n'est trouvé.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.code}
                                        onSelect={() => handleProjectSelect(project)}
                                        className="flex items-center p-2 hover:bg-gray-100"
                                    >
                                        {selectedProjectCode === project.code && (
                                            <Check className="mr-2 h-4 w-4 text-blue-500" />
                                        )}
                                        {project.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>

            {/* Affichage des informations du projet sélectionné
            {selectedProject && (
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>{selectedProject.name}</CardTitle>
                        <CardDescription>{selectedProject.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                    </CardContent>
                </Card>
            )} */}

            {error && <p className="text-red-500">{error}</p>}
        </>
    );
};

export default SelectProjectField;
