export function isFieldEmpty(question, answer) {
    const { value } = answer;

    if (question.type === 'string') {
        return !value || value.trim() === ''
    }

    if (['autocomplete', 'select'].includes(question.type) && Array.isArray(value)) {
        return value.length === 0;
    }

    if (['autocomplete', 'select', 'image_picker', 'radio', 'checkbox'].includes(question.type)) {
        return typeof value === 'undefined'   
    }

    return !value
}