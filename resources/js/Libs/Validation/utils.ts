export function transformObject(obj: Record<string, string[]>) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        result[key] = value[0];
        return result;
    }, {} as Record<string, string>)
}

export function deepDotKeys(obj: { [key: string]: any }, parentKey: string = ""): string[] {
    return Object.keys(obj).reduce<string[]>((keys, key) => {
        const dottedKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof obj[key] === "object" && obj[key] !== null) {
            return keys.concat(deepDotKeys(obj[key], dottedKey));
        } else {
            return keys.concat(dottedKey);
        }
    }, []);
}