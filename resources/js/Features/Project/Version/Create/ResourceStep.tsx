import React from "react";
import { CreateProjectContext } from "@/Contexts/Project/create-project-context"; 
import { FormProps } from "@/Components/Stepper";
import { Heading } from "@/Components/ui/heading";
import { Button } from "@/Components/ui/button";
import * as Accordion from "@/Components/ui/accordion";
import { useSessionStorage } from "@/Hooks/use-session-storage-with-object";
import Field from "@/Libs/FormBuilder/components/Field";
import * as Command from "@/Components/ui/command";
import { useDebounce } from "@/Hooks/use-debounce";
import { skipToken, useQuery } from "@tanstack/react-query";
import { searchExistingResources } from "@/Services/api/resources";
import { LoaderCircle } from "lucide-react";
import { Kbd } from "@/Components/ui/kbd";
import { Skeleton } from "@/Components/ui/skeleton";

const ResourceForm = ({ next, prev }: FormProps) => {
    const { data, processing } = React.useContext(CreateProjectContext);
    const [accordionState, setAccordionState] = useSessionStorage(
        "accordion-state",
        ["1"]
    );

    const goNext = () => {
        next();
    };

    return (
        <div className="space-y-8">
            <Accordion.Accordion
                type="multiple"
                value={accordionState}
                onValueChange={(value) => {
                    setAccordionState(value);
                }}
            >
                <Accordion.AccordionItem value="1">
                    <Accordion.AccordionTrigger>
                        Matériel existant pouvant être utilisé dans l'exécution
                        du projet.
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        <ResourceSelecter />
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value="2">
                    <Accordion.AccordionTrigger>
                        Matière première, composants et petits équipements à
                        acquérir par le CRTI
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                        <ResourceCrti />
                    </Accordion.AccordionContent>
                </Accordion.AccordionItem>
                {data.is_partner && (
                    <Accordion.AccordionItem value="3">
                        <Accordion.AccordionTrigger>
                            Matière première, composants et petits équipements à
                            acquérir par le partenaire socio-économique
                        </Accordion.AccordionTrigger>
                        <Accordion.AccordionContent>
                            <ResourcePartner />
                        </Accordion.AccordionContent>
                    </Accordion.AccordionItem>
                )}
            </Accordion.Accordion>

            <div className="flex gap-4 max-w-lg mx-auto">
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={prev}
                >
                    Précendant
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    disabled={processing}
                    onClick={goNext}
                >
                    Suivant
                </Button>
            </div>
        </div>
    );
};

const ResourceSelecter = () => {
    const {} = React.useContext(CreateProjectContext);
    const [search, setSearch] = React.useState("");
    const debouncedValue = useDebounce(search, 300);
    const commandInputRef = React.useRef<HTMLInputElement>(null);

    const { data, isFetching, isLoading, isError, isSuccess } = useQuery({
        queryKey: ["search-existing-resources", debouncedValue],
        queryFn: debouncedValue
            ? async ({ signal }) =>
                  searchExistingResources(debouncedValue, { signal })
            : skipToken,
    });

    return (
        <div className="px-4">
            <Command.Command loop shouldFilter={false} className="outline-none">
                <Command.CommandHeader>
                    <Command.CommandInput
                        ref={commandInputRef}
                        value={search}
                        onValueChange={setSearch}
                        placeholder="Rechercher..."
                        autoFocus
                    />
                    {isFetching && (
                        <LoaderCircle className="animate-spin mr-2" />
                    )}
                    <Command.CommandShortcut>
                        <Kbd>ctrl+K</Kbd>
                    </Command.CommandShortcut>
                </Command.CommandHeader>
                <Command.CommandList className="max-h-none">
                    <Command.CommandEmpty className="py-4">
                        {!search ? (
                            <div className="text-gray-800 font-medium text-lg">
                                Commencez à taper pour rechercher des resourecs
                                existant peuvent étre utiliser dans ce projet
                            </div>
                        ) : isLoading ? (
                            <div className="px-2.5 space-y-4">
                                {Array.from({ length: 3 }, (_, idx) => idx).map(
                                    (_, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-4"
                                        >
                                            <Skeleton className="h-12 w-12 rounded" />
                                        </div>
                                    )
                                )}
                            </div>
                        ) : isError ? (
                            <>error</>
                        ) : (
                            <>Aucun resultat trouvé.</>
                        )}
                    </Command.CommandEmpty>
                    {isSuccess && (
                        <Command.CommandGroup className="p-0">
                            {/* {data.map(resource) =>} */}
                        </Command.CommandGroup>
                    )}
                </Command.CommandList>
            </Command.Command>
        </div>
    );
};

const ResourceCrti = () => {
    return <div>resources crti</div>;
};

const ResourcePartner = () => {
    return <div>resources partner</div>;
};

export default ResourceForm;
