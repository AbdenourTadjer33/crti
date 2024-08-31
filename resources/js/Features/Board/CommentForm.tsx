import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { FormWrapper } from "@/Components/ui/form";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/Components/ui/toggle-group";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/Components/ui/tooltip";
import { Board } from "@/types";
import { Link, useForm } from "@inertiajs/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface AddCommentProps {
    board: Board;
}

const AddCommentForm: React.FC<AddCommentProps> = ({ board }) => {
    const { data, setData, post, processing, errors } = useForm({
        comment: "",
        isFavorable: undefined,
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(route("board.comment.store", { board: board.code }), {
            onSuccess: () => {
                setData("comment", "");
            },
        });
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit}
            className="rounded-none shadow-none border-0"
        >
            <div className="space-y-2">
                <Textarea
                    placeholder="Écrivez votre commentaire ici..."
                    value={data.comment}
                    onChange={(e) => setData("comment", e.target.value)}
                    required
                    rows={4}
                />

                <div className="flex items-center justify-between">
                    <ToggleGroup
                        type="single"
                        value={data.isFavorable}
                        onValueChange={(value) => setData("isFavorable", value)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <ToggleGroupItem value="1">
                                        <ThumbsUp className="h-6 w-6" />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>Avis favorable</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <ToggleGroupItem value="0">
                                        <ThumbsDown className="h-6 w-6" />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>Avis défavorable</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </ToggleGroup>

                    <Button variant="primary" disabled={processing}>
                        Commenter
                    </Button>
                </div>
            </div>
        </FormWrapper>
    );
};

export default AddCommentForm;
