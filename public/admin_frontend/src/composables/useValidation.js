import { isFieldEmpty } from "./isFieldEmpty";

export function useValidation(question) {
    const availableValidations = {
        required: (answer) => !isFieldEmpty(question, answer) || 'Campo obrigatório',
        email: (answer) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            return emailRegex.test(answer.value) || 'E-mail inválido';
        },
        url: (answer) => {
            const urlRegex = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ig;
            
            return urlRegex.test(answer.value) || 'URL inválida';
        },
        minLength: (answer, config) => {
            const minLength = config.value || 0;

            return answer.value.length >= minLength || `Mínimo de ${minLength} caracteres`;
        },
        maxLength: (answer, config) => {
            const maxLength = config.value || 0;

            return answer.value.length <= maxLength || `Máximo de ${maxLength} caracteres`;
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


    function validate(answer) {
        const errors = [];

        for (const rule of rules) {
            const isValidOrErrorMessage = rule.validate(answer, rule.config);
            
            if (isValidOrErrorMessage !== true) {
                errors.push(rule.config.message || isValidOrErrorMessage);
            }
        }

        return errors;
    }

    return { validate }
}