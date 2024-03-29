import { isFieldEmpty } from "./isFieldEmpty"
import template from 'lodash/template'

export function getFormProgress(questions, answers) {

    const currentAnswers = answers.reduce((acc, a) => ({
        ...acc,
        [a.question_id]: a.versions.at(-1).value
    }), {})

    const requiredQuestions = questions.filter(q => {
        if (!q.config?.if) return true

        const results = q.config.if
                .map(op => template(op, { interpolate: /{{([\s\S]+?)}}/g }))
                .map(compiled => compiled({ currentAnswers }))
                .map(r => r === 'true')

        return results.every(r => r)
    })

    const filledAnswers = answers.filter(a => a.versions.length)
        .filter(a => {
            const question = requiredQuestions.find(q => q.id === a.question_id)
            const answer = a.versions.at(-1)

            if (answer.markedAsEmpty) return true

            if (!question || !answer) return false

            return !isFieldEmpty(question, answer)
        })

    return Math.round(Math.min((filledAnswers.length / requiredQuestions.length) * 100, 100))
}