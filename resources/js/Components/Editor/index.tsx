import React from "react";
import {
    Content,
    EditorContent,
    EditorEvents,
    Extensions,
    FocusPosition,
    JSONContent,
    useEditor,
    Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Color from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { cn } from "@/Utils/utils";
import { FixedMenu } from "./partials/fixed-menu";
import { EditorProps } from "@tiptap/pm/view";
import { Skeleton } from "../ui/skeleton";

type ClassNames = {
    root: string;
    wrapper: string;
    content: string;
    fixedMenu: string;
};

type Menu = "top" | "bottom";

type SlotFn = (editor: Editor) => React.ReactNode | undefined;
type OnContentChange = (content: {
    json: JSONContent;
    html: string;
    text: string;
}) => void;
type EditorPropsFn = () => EditorProps;

interface RichEditorProps {
    className?: string;
    classNames?: Partial<ClassNames>;
    editable?: boolean;
    content?: Content;
    onContentChange?: OnContentChange;
    extensions?: (extensions: any) => Extensions;
    menu?: Partial<Menu>;
    slotBefore?: (editor: Editor) => React.ReactNode;
    slotAfter?: (editor: Editor) => React.ReactNode;
    autofocus?: FocusPosition;
    spellCheck?: boolean;
}

/**
 * base extension is bunch of extension pre configured for you.
 */
const baseExtensions = [
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        document: false,
    }),
    Document,
    // Color.configure({ types: [TextStyle.name, ListItem.name] }),
    // TextStyle,
    Underline,
    Link,
];

const RichEditor: React.FC<RichEditorProps> = ({
    className = "",
    classNames,
    editable = true,
    content,
    onContentChange,
    extensions,
    menu = "top",
    slotBefore,
    slotAfter,
    autofocus,
    spellCheck = true,
}) => {
    const extensionFn = (): Extensions => {
        if (!extensions) return baseExtensions;

        return extensions({
            StarterKit,
            Document,
            Color,
            TextStyle,
            Underline,
            Link,
            Placeholder,
        });
    };

    const slotBeforeFn: SlotFn = (editor) => {
        if (slotBefore) return slotBefore(editor);
        if (menu === "top")
            return (
                <FixedMenu
                    editor={editor}
                    className={cn(classNames?.fixedMenu)}
                />
            );
        return undefined;
    };

    const slotAfterFn: SlotFn = (editor) => {
        if (slotAfter) return slotAfter(editor);
        if (menu === "bottom")
            return (
                <FixedMenu
                    editor={editor}
                    className={cn(classNames?.fixedMenu)}
                />
            );
        return undefined;
    };

    const onUpdateFn = ({ editor }: EditorEvents["update"]) => {
        onContentChange &&
            onContentChange({
                json: editor.getJSON(),
                html: editor.getHTML(),
                text: editor.getText(),
            });
    };

    const editorPropsFn: EditorPropsFn = () => {
        return {
            attributes: {
                class: cn(
                    "p-2 prose prose-slate prose-sm sm:prose-base dark:prose-invert prose-a:text-blue-600 focus:outline-none max-w-full focus:outline-none min-h-32 resize-y overflow-y-auto first:*:mt-0",
                    classNames?.content
                ),
                spellCheck: String(spellCheck),
            },
        };
    };

    const editor = useEditor({
        content: content,
        onUpdate: onUpdateFn,
        extensions: extensionFn(),
        editable: editable,
        autofocus: autofocus,
        editorProps: editorPropsFn(),
        immediatelyRender: true,
    });

    if (!editor) {
        return <Skeleton className="h-40 w-full" />;
    }

    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-700 rounded border dark:border-gray-600",
                className,
                classNames?.root
            )}
        >
            {editable && slotBeforeFn(editor)}
            <EditorContent
                editor={editor}
                className={cn(classNames?.wrapper)}
            />
            {editable && slotAfterFn(editor)}
        </div>
    );
};

export { type OnContentChange, RichEditor as Editor };
