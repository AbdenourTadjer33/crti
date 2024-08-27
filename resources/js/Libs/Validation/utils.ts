export function transformObject(obj: Record<string, string[]>) {
    return Object.entries(obj).reduce((result, [key, value]) => {
        result[key] = value[0];
        return result;
    }, {} as Record<string, string>)
}

export function deepKeys(obj: Record<string, any>, parentKey: string = "", sep: string = "."): string[] {
    return Object.keys(obj).reduce<string[]>((keys, key) => {
        const deepKey = parentKey ? `${parentKey}${sep}${key}` : key;

        keys.push(deepKey); // Include the key for the current object or array

        if (typeof obj[key] === "object" && obj[key] !== null) {
            if (Array.isArray(obj[key])) {
                obj[key].forEach((item, index) => {
                    if (typeof item === "object" && item !== null) {
                        keys = keys.concat(deepKeys(item, `${deepKey}${sep}${index}`, sep));
                    } else {
                        keys.push(`${deepKey}${sep}${index}`);
                    }
                });
            } else {
                keys = keys.concat(deepKeys(obj[key], deepKey, sep));
            }
        }

        return keys;
    }, []);
}

export function keysBeginWith(obj: Record<string, any>, pattern: string): string[] {
    return Object.keys(obj).filter(key => key.startsWith(pattern));
}

export function isAnyKeyBeginWith(obj: Record<string, any>, pattern: string): boolean {
    for (const key in obj) {
        if (key.startsWith(pattern)) {
            return true;
        }
    }
    
    return false;
}