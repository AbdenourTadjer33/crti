function capitalize(word: string) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getInitials(name: string) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function isNumber(any: any): boolean {
    return !isNaN(Number(any));
}

function assert(condition: any, message: string) {
    if (!condition) {
        throw new Error(message);
    }
}

function searchForKeyByPattern(obj: object, key: string) {
    return Object.keys(obj);
}

function isKeyExisit(obj: object, key: string) {
    return Object.keys(obj);
}

export { capitalize, route, assert, searchForKeyByPattern, isKeyExisit, getInitials };
