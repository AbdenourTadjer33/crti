import React from "react";
import { Link } from "@inertiajs/react";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbLink,
    BreadcrumbItem,
    BreadcrumbSeparator,
    BreadcrumbPage,
    BreadcrumbEllipsis,
} from "@/Components/ui/breadcrumb";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/Components/ui/drawer";
import { Button } from "@/Components/ui/button";

import { useMediaQuery } from "@/Hooks/use-media-query";

export default function ({
    items,
    MAX_ITEMS = 3,
}: {
    items: { href?: string; label: string | React.ReactElement }[];
    MAX_ITEMS?: number;
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={items[0].href ?? "#"}>
                            {items[0].label}
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                {items.length > MAX_ITEMS ? (
                    <>
                        <BreadcrumbItem>
                            {isDesktop ? (
                                <DropdownMenu
                                    open={open}
                                    onOpenChange={setOpen}
                                >
                                    <DropdownMenuTrigger
                                        className="flex items-center gap-1"
                                        aria-label="Toggle menu"
                                    >
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        {items
                                            .slice(1, -2)
                                            .map((item, index) => (
                                                <DropdownMenuItem key={index}>
                                                    <Link
                                                        href={
                                                            item.href
                                                                ? item.href
                                                                : "#"
                                                        }
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Drawer open={open} onOpenChange={setOpen}>
                                    <DrawerTrigger aria-label="Toggle Menu">
                                        <BreadcrumbEllipsis className="h-4 w-4" />
                                    </DrawerTrigger>
                                    <DrawerContent>
                                        <DrawerHeader className="text-left">
                                            <DrawerTitle>
                                                Navigate to
                                            </DrawerTitle>
                                            <DrawerDescription>
                                                Select a page to navigate to.
                                            </DrawerDescription>
                                        </DrawerHeader>
                                        <div className="grid gap-1 px-4">
                                            {items
                                                .slice(1, -2)
                                                .map((item, index) => (
                                                    <Link
                                                        key={index}
                                                        href={
                                                            item.href
                                                                ? item.href
                                                                : "#"
                                                        }
                                                        className="py-1 text-sm"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                ))}
                                        </div>
                                        <DrawerFooter className="pt-4">
                                            <DrawerClose asChild>
                                                <Button variant="outline">
                                                    Close
                                                </Button>
                                            </DrawerClose>
                                        </DrawerFooter>
                                    </DrawerContent>
                                </Drawer>
                            )}
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                    </>
                ) : null}
                {items.slice(-MAX_ITEMS + 1).map((item, index) => (
                    <React.Fragment key={index}>
                        <BreadcrumbItem>
                            {item.href ? (
                                <>
                                    <BreadcrumbLink
                                        asChild
                                        className="max-w-20 truncate md:max-w-none"
                                    >
                                        <Link href={item.href}>
                                            {item.label}
                                        </Link>
                                    </BreadcrumbLink>
                                </>
                            ) : (
                                <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                                    {item.label}
                                </BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                        {items.slice(-MAX_ITEMS + 1).length - index > 1 && (
                            <BreadcrumbSeparator />
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
