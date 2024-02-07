import { isFieldEmpty } from "./isFieldEmpty";

export function getFormProgress(questions, answers) {
    const filledAnswers = answers.filter(a => a.versions.length)
        .filter(a => {
            const question = questions.find(q => q.id === a.question_id);

            const version = a.versions.at(-1);

            return !isFieldEmpty(question, version.value);
        })

    return Math.round(Math.min((filledAnswers.length / questions.length) * 100, 100))
}