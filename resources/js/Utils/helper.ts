function capitalize(word: string) {
    if (word.length === 0) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getInitials(name: string) {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
}

function currencyFormat(number: any) {
    return new Intl.NumberFormat("fr", {
        style: "currency",
        currency: "dzd",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(number);
};

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

function generatePassword(length = 12) {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    // All characters combined
    const allChars = uppercase + lowercase + numbers + specialChars;

    let password = '';

    // Ensure the password contains at least one character from each required set
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the remaining length with random characters from the combined set
    for (let i = 4; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    password = password.split('').sort(() => 0.5 - Math.random()).join('');

    return password;
}

export { capitalize, route, assert, searchForKeyByPattern, isKeyExisit, getInitials, currencyFormat, generatePassword };
