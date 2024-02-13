import template from 'lodash/template'

export function getFormRequiredQuestions(questions, answers) {

    const currentAnswers = answers.reduce((acc, a) => ({
        ...acc,
        [a.question_id]: a.versions.at(-1).value
    }), {})

    const requiredQuestions = questions.filter(q => {
        if (!q.config?.if) return true;

        const results = q.config.if
                .map(op => template(op, { interpolate: /{{([\s\S]+?)}}/g }))
                .map(compiled => compiled({ currentAnswers }))
                .map(r => r === 'true')

        return results.every(r => r)
    })

    return requiredQuestions
}