export interface User {
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    user: User;
};
