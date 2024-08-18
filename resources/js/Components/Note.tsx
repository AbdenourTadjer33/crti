import React from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { Edit, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSessionStorage } from "@/Hooks/use-session-storage-with-object";
import { capitalize } from "@/Utils/helper";
import { Editor, OnContentChange } from "./Editor";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

type Position = { x: number; y: number };
type Size = { width: number; height: number };

interface NoteProps {
    /**
     * optinal unique id for the note block, this id is very helpful when using many note's on one page.
     * You should provide the id when the note is related to something.
     */
    id?: string;
    title?: string;
    trigger?: (props: TriggerProps) => React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    position?: Position;
    onPositionChange?: (position: Position) => void;
    size?: Size;
    onSizeChange?: (size: Size) => void;
}

interface TriggerProps {
    isOpen: boolean;
}

interface NoteContextProps {
    _uniqueId: string;
    title?: string;
    trigger?: (props: TriggerProps) => React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    _open: boolean;
    _setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    position?: Position;
    onPositionChange?: (position: Position) => void;
    _position: Position;
    _setPosition: React.Dispatch<React.SetStateAction<Position>>;
    size?: Size;
    onSizeChange?: (size: Size) => void;
    _size: Size;
    _setSize: React.Dispatch<React.SetStateAction<Size>>;
}

interface NoteProviderProps extends React.PropsWithChildren {
    provider: NoteContextProps;
}

const NoteContext = React.createContext<NoteContextProps>({
    _uniqueId: "",
    _open: false,
    _setOpen: () => {},
    _position: { x: 0, y: 0 },
    _setPosition: () => {},
    _size: { width: 0, height: 0 },
    _setSize: () => {},
});

const NoteProvider: React.FC<NoteProviderProps> = ({ provider, children }) => {
    return (
        <NoteContext.Provider value={provider}>{children}</NoteContext.Provider>
    );
};

const Note: React.FC<NoteProps> = ({
    id,
    title,
    trigger,
    value,
    onValueChange,
    open,
    onOpenChange,
    position,
    onPositionChange,
    size,
    onSizeChange,
    ...props
}) => {
    const _uniqueId = React.useMemo(() => {
        return id ?? crypto.randomUUID();
    }, []);
    const [_open, _setOpen] = useSessionStorage(
        `${_uniqueId}-displayed-state`,
        open ?? false
    );
    const [_position, _setPosition] = useSessionStorage(
        `${_uniqueId}-position-state`,
        position ?? { x: 0, y: 0 }
    );
    const [_size, _setSize] = useSessionStorage(
        `${_uniqueId}-size-state`,
        size ?? { width: 400, height: 200 }
    );

    return (
        <NoteProvider
            provider={{
                title,
                trigger,
                _uniqueId,
                value,
                onValueChange,
                open,
                onOpenChange,
                _open,
                _setOpen,
                position,
                onPositionChange,
                _position,
                _setPosition,
                size,
                onSizeChange,
                _size,
                _setSize,
            }}
        >
            <NoteDialog>
                <NoteContent />
            </NoteDialog>
        </NoteProvider>
    );
};

const NoteDialog: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { _open, _setOpen, onOpenChange } = React.useContext(NoteContext);

    const handleOpenChange = (open: boolean) => {
        _setOpen(open);

        onOpenChange && onOpenChange(open);
    };

    return (
        <DialogPrimitive.Root
            modal={false}
            open={_open}
            onOpenChange={handleOpenChange}
        >
            <DialogPrimitive.Trigger>
                <NoteTrigger />
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay />
                <DialogPrimitive.Content
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => e.preventDefault()}
                    className="fixed top-0 left-0 m-4 z-50"
                >
                    {children}
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
};

const NoteTrigger = () => {
    const { trigger, _open } = React.useContext(NoteContext);

    if (!trigger) {
        return <Edit className="h-5 w-5" />;
    }

    return trigger({
        isOpen: _open,
    });
};

const NoteContent = () => {
    const {
        title,
        _uniqueId,
        value,
        onValueChange,
        _setOpen,
        _size,
        _setSize,
        _position,
        _setPosition,
    } = React.useContext(NoteContext);

    const resizeHandler: RndResizeCallback = (
        e,
        direction,
        ref,
        delta,
        position
    ) => {
        _setSize({
            width: ref.offsetWidth,
            height: ref.offsetHeight,
        });

        _setPosition({
            x: position.x,
            y: position.y,
        });
    };

    const dragHandler: RndDragCallback = (e, d) => {
        _setPosition({
            x: d.x,
            y: d.y,
        });
    };

    const contentChangeFn: OnContentChange = ({ html }) => {
        onValueChange && onValueChange(html);
    };

    const SlotBefore = () => {
        return (
            <div
                className={`drag-handler-${_uniqueId} cursor-move bg-gray-900 px-2.5 py-2 flex items-center justify-between gap-4`}
            >
                <div className="text-gray-50 text-sm text-pretty">
                    {capitalize(title ?? "")}
                </div>
                <button
                    className="text-gray-50 hover:opacity-75"
                    onClick={() => _setOpen(false)}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>
        );
    };

    return (
        <Rnd
            size={_size}
            onResizeStop={resizeHandler}
            position={_position}
            onDragStop={dragHandler}
            dragHandleClassName={`drag-handler-${_uniqueId}`}
            bounds="window"
            minWidth={550}
            minHeight={250}
            maxWidth={750}
            maxHeight={450}
            className="shadow-xl overflow-hidden opacity-100"
        >
            <Editor
                menu="bottom"
                content={value}
                onContentChange={contentChangeFn}
                slotBefore={SlotBefore}
                className="h-full flex flex-col justify-between border-none rounded-sm overflow-hidden"
                classNames={{
                    wrapper: "flex-grow overflow-auto",
                    content: "max-h-none h-full",
                    fixedMenu: "border-b-0 border-t",
                }}
                extensions={() => {
                    return [
                        StarterKit.configure({
                            bulletList: {
                                keepMarks: true,
                                keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                            },
                            orderedList: {
                                keepMarks: true,
                                keepAttributes: true, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
                            },
                        }),
                        Underline,
                        Link,
                        Placeholder.configure({
                            placeholder: "La description de la tâche..."
                        })
                    ];
                }}
            />
        </Rnd>
    );
};

export { type NoteProps, Note };
