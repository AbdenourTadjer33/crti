import { route as ZiggyRoute, RouteName, RouteParams } from "ziggy-js";
import { Ziggy } from "@/ziggy";

function route<T extends RouteName>(
    name: T,
    params?: RouteParams<T> | undefined,
    absolute?: boolean
): string {
    return ZiggyRoute(name, params, absolute, Ziggy);
}

function capitalize(word: string) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export { capitalize, route };
