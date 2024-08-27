import { UUID } from "crypto";
import { MemberBoard } from "./member";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        alert?: Record<string, unknown>;
        info?: Record<string, unknown>;
    };
};

export type Unit = {
    id: string;
    name: string;
    abbr?: string;
    description?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
    divisions?: Division[];
    divisionCount?: number;
};

export type Division = {
    id?: string;
    name: string;
    abbr: string
    description?: string;
};

export type User = {
    id: number;
    unitId?: number;
    divisionId?: number;
    uuid: UUID;
    name: string;
    email: string;
    isEmailVerified: boolean;
    status: boolean;
    dob?: number;
    sex?: number;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    permissions?: Permission[];
    roles?: Role[];
    division?:
    {
        grade: string;
        addedAt: string;
    };
    boards?:
    {
        addedAt: string;
    };
};

export type Permission = {
    id: string;
    model: string;
    action: string;
    type: number;
    createdAt?: string;
    updatedAt?: string;
};

export type Role = {
    id: string;
    name: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
    permissions?: Permission[];
    permissionIds: number[];
};

export type Board = {
    id?: string;
    name: string;
    abbr: string
    description?: string;
    user: User[];
    userCount?: number;
    createdAt?: string,
    updatedAt?: string,
};

type PaginationLinks = {
    first: string;
    last: string;
    next?: string;
    prev?: string;
};

type PaginationMetaLink = {
    url?: string;
    label: string;
    active: boolean;
};

type PaginationMeta = {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationMetaLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
};

export interface Pagination<TData> {
    data: TData[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

