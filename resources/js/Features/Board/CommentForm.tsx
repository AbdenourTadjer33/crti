import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { FormWrapper } from "@/Components/ui/form";
import { InputError } from "@/Components/ui/input-error";
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
import { Link, router, useForm } from "@inertiajs/react";
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
            preserveScroll: "errors",
        });
    };

    return (
        <FormWrapper
            onSubmit={handleSubmit}
            className="rounded-none shadow-none border-0 space-y-2"
        >
            {!!Object.keys(errors).length && (
                <ul>
                    {Object.keys(errors).map((error, idx) => (
                        <li key={idx}>
                            <InputError message={errors[error]} />
                        </li>
                    ))}
                </ul>
            )}

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
                            <ToggleGroupItem value="1" asChild>
                                <TooltipTrigger>
                                    <ThumbsUp className="h-6 w-6" />
                                </TooltipTrigger>
                            </ToggleGroupItem>
                            <TooltipContent>Avis favorable</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <ToggleGroupItem value="0" asChild>
                                <TooltipTrigger>
                                    <ThumbsDown className="h-6 w-6" />
                                </TooltipTrigger>
                            </ToggleGroupItem>
                            <TooltipContent>Avis défavorable</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </ToggleGroup>

                <Button variant="primary" disabled={processing}>
                    Commenter
                </Button>
            </div>
        </FormWrapper>
    );
};

export default AddCommentForm;
