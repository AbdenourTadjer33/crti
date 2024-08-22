import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/Components/ui/pagination";
import { PaginationLinks, PaginationMeta } from "@/types";

export default function ({
    links,
    meta,
}: {
    links: PaginationLinks;
    meta: PaginationMeta;
}) {
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href={links.prev} />
                </PaginationItem>

                {meta.links.slice(1, -1).map((link, idx) => (
                    <PaginationItem key={idx}>
                        {link.label === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href={link.url}
                                isActive={link.active}
                                onClick={(e) =>
                                    link.active && e.preventDefault()
                                }
                            >
                                {link.label}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext href={links.next} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
