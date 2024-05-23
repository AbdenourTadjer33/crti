export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    flash: {
        alert?: Record<string, unknown>;
    };
};

export type Unit = {
    id: string;
    name: string;
    abbr?: string;
    description?: string;
    address?: string;
    city?: string;
    country?: string;
    createdAt?: string;
    updatedAt?: string;
    divisions?: Division[];
};

export type Division = {
    id?: string;
    name: string;
    description?: string;
};

export type User = {
    uuid: string;
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
