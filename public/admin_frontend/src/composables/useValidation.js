const availableValidations = {
    required: (value) => !!value || 'Campo obrigatório',
}

export function useValidation(question) {
    const rules = []

    if (question.config?.rules) {
        for (const ruleConfig of question.config.rules) {
            if (availableValidations[ruleConfig.name]) {
                rules.push(availableValidations[ruleConfig.name]);
            }
        }
    }


    function validate(value) {
        const errors = [];

        for (const rule of rules) {
            const error = rule(value);
            
            if (error !== true) {
                errors.push(error);
            }
        }

        return errors;
    }

    return { validate }
}