import { isFieldEmpty } from "./isFieldEmpty";

export function useValidation(question) {
    const availableValidations = {
        required: (value) => !isFieldEmpty(question, value) || 'Campo obrigatório',
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            return emailRegex.test(value) || 'E-mail inválido';
        },
        url: (value) => {
            const urlRegex = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ig;
            
            return urlRegex.test(value) || 'URL inválida';
        },
        minLength: (value, config) => {
            const minLength = config.value || 0;

            return value.length >= minLength || `Mínimo de ${minLength} caracteres`;
        },
        maxLength: (value, config) => {
            const maxLength = config.value || 0;

            return value.length <= maxLength || `Máximo de ${maxLength} caracteres`;
        },
    }

    const rules = []

    if (question.config?.rules) {
        for (const ruleConfig of question.config.rules) {
            if (availableValidations[ruleConfig.name]) {
                rules.push({
                    config: ruleConfig,
                    validate: availableValidations[ruleConfig.name]
                });
            }
        }
    }


    function validate(value) {
        const errors = [];

        for (const rule of rules) {
            const isValidOrErrorMessage = rule.validate(value, rule.config);
            
            if (isValidOrErrorMessage !== true) {
                errors.push(rule.config.message || isValidOrErrorMessage);
            }
        }

        return errors;
    }

    return { validate }
}