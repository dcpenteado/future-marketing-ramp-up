export function isFieldEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return !!value
}