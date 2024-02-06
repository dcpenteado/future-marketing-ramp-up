export function isFieldEmpty(question, value) {

    if (question.type === 'checkbox') {
        return false
    }

    if (question.type === 'radio') {
        return false
    }

    if (question.type === 'autocomplete') {
        return Array.isArray(value) ? value.length === 0 : !value
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    return !value
}