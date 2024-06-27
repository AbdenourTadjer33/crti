import React from "react";
import { useCurrentEditor } from "@tiptap/react";
import { Bold, ChevronDown, Italic, Strikethrough } from "lucide-react";
import { Toggle } from "@/Components/ui/toggle";
import * as Dropdown from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { cn } from "@/Utils/utils";

interface FixedMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

const FixedMenu: React.FC<FixedMenuProps> = ({ className, ...props }) => {
    const { editor } = useCurrentEditor();

    if (!editor) return null;

    return (
        <div className={cn("flex flex-wrap gap-1", className)} {...props}>
            <Toggle
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                pressed={editor.isActive("bold")}
            >
                <Bold className="h-4 w-4" />
            </Toggle>

            <Toggle
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                pressed={editor.isActive("italic")}
            >
                <Italic className="h-4 w-4" />
            </Toggle>

            <Toggle
                variant="outline"
                size="sm"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                pressed={editor.isActive("strike")}
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>

            <Dropdown.DropdownMenu>
                <Dropdown.DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="justify-between gap-4"
                    >
                        open
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </Dropdown.DropdownMenuTrigger>
                <Dropdown.DropdownMenuContent>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 1 })
                                .run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("heading", { level: 1 })}
                    >
                        Heading 1
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 2 })
                                .run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("heading", { level: 2 })}
                    >
                        Heading 2
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 3 })
                                .run()
                        }
                        data-selected={editor.isActive("heading", { level: 3 })}
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                    >
                        Heading 3
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 4 })
                                .run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("heading", { level: 4 })}
                    >
                        Heading 4
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 5 })
                                .run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("heading", { level: 5 })}
                    >
                        Heading 5
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor
                                .chain()
                                .focus()
                                .toggleHeading({ level: 6 })
                                .run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("heading", { level: 6 })}
                    >
                        Heading 6
                    </Dropdown.DropdownMenuItem>
                    <Dropdown.DropdownMenuItem
                        onClick={() =>
                            editor.chain().focus().setParagraph().run()
                        }
                        className=" data-[selected=true]:bg-gray-200/65 cursor-pointer"
                        data-selected={editor.isActive("paragraph")}
                    >
                        Paragraph
                    </Dropdown.DropdownMenuItem>
                </Dropdown.DropdownMenuContent>
            </Dropdown.DropdownMenu>
        </div>
    );
};

export { FixedMenu };
