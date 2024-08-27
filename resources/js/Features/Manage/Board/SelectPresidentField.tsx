import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import { Button } from "@/Components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/Components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { User } from "@/types";
import { getInitials } from "@/Utils/helper";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";


interface SelectPresidentFieldProps {
    presidents: User[];
    initialSelectedPresident?: string;
    onPresidentChange?: (presidentUuid: string | null) => void;
    error?: string;
}

const SelectPresidentField: React.FC<SelectPresidentFieldProps> = ({
    presidents,
    initialSelectedPresident,
    onPresidentChange,
    error,
}) => {
    const [selectedPresidentUuid, setSelectedPresidentUuid] = useState<string | null>(initialSelectedPresident || null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (initialSelectedPresident) {
            setSelectedPresidentUuid(initialSelectedPresident);
        } else {
            setSelectedPresidentUuid(null);
        }
    }, [initialSelectedPresident]);

    const handlePresidentSelect = (president: User) => {
        const newSelectedPresidentUuid = selectedPresidentUuid === president.uuid ? null : president.uuid;
        setSelectedPresidentUuid(newSelectedPresidentUuid);
        if (onPresidentChange) {
            onPresidentChange(newSelectedPresidentUuid);
        }
        setIsOpen(false);
    };

    const selectedPresident = presidents.find(president => president.uuid === selectedPresidentUuid);
    const selectedPresidentName = selectedPresident ? selectedPresident.name : "Sélectionner un président";

    return (
        <div className="space-y-1 col-span-3">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className="flex items-center justify-between w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {selectedPresidentName}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-80">
                    <Command>
                        <CommandInput placeholder="Rechercher un président..." />
                        <CommandEmpty>
                            Aucun président avec ce nom n'est trouvé.
                        </CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                {presidents.map((president) => (
                                    <CommandItem
                                        key={president.uuid}
                                        onSelect={() => handlePresidentSelect(president)}
                                        className="flex items-center p-2 hover:bg-gray-100 gap-2"
                                    >
                                        {selectedPresidentUuid === president.uuid && (
                                            <Check className="mr-2 h-4 w-4 text-blue-500" />
                                        )}
                                        <Avatar>
                                            <AvatarFallback>
                                                {getInitials(president.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        {president.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default SelectPresidentField;
