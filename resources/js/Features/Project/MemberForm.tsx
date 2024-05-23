import { Button } from "@/Components/ui/button";
import { Heading } from "@/Components/ui/heading";
import React from "react";
import { CreateProjectContext } from "./CreateProject";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/Components/ui/accordion";
import { ExternalMemberForm } from "./ExternalMemberForm";


const MemberForm = () => {
    const { data, setData, errors } = React.useContext(CreateProjectContext);
    // const [member, setMember] = React.useState([0]);

    // const addMember = () => {
    //     setMember([...member, member.length]);
    // };

    // const removeMember = (index) => {
    //     setMember(member.filter((_, idx) => idx !== index));
    //     const newMember = data.members.filter((_, idx) => idx !== index);
    //     setData('members', newMember);
    // };


    return (
        <div className="md:grid grid-cols-3 gap-4">
             <div className="py-5 col-span-3">
                <Heading level={4}>Membres du project</Heading>
            </div>

            <div className="space-y-2 col-span-3">
                <Accordion type="single" collapsible>
                    <AccordionItem value="1">
                        <AccordionTrigger>
                            selectionnez un membre interne
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="flex items-center justify-between gap-2">
                                <Button
                                    type="button"
                                    className="sm:hidden"
                                >
                                    Ajouter un utilisateur
                                </Button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="space-y-2 col-span-3">
                <ExternalMemberForm/>
            </div>


        </div>
    );
}
export default MemberForm;

