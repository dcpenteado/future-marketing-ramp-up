const availableValidations = {
    required: (value) => !!value || 'Campo obrigatório',
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return emailRegex.test(value) || 'E-mail inválido';
    },
    url: (value) => {
        const urlRegex = /[(http(s)?)://(www.)?a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/ig;
        
        return urlRegex.test(value) || 'URL inválida';
    },
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