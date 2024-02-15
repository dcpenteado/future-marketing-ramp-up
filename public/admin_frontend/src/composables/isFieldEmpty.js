export function isOccupationFormEmpty(answer) {
    const payload = answer.value;

    if (!payload) return true;

    const baseFields = [
        'category',
        'name',
        'introduction',
        'howTheAttendanceIsDone',
        'aboutTheProfessional'
    ];

    const categories = {
        'Tratamento': ['treatmentHowItWorks'],
        'Cirurgia': ['surgeryWhenIsRecommended', 'surgeryInterventionTypes'],
        'Procedimento': ['procedureRecommendations', 'procedureResults'],
        'Enfermidade': ['diseaseSymptoms', 'diseaseDiagnosis', 'diseaseTreatments'],
        'Área de atuação': ['areaWhenLookFor', 'areaAdvantages']
    }

    if (baseFields.some(f => !payload[f])) return true;

    if (categories[payload.category].some(f => !payload[f])) return true;

    return false
}

export function isFieldEmpty(question, answer) {
    const { value } = answer;

    if (question.type === 'string') {
        return !value || value.trim() === ''
    }

    if (question.type === 'occupation_form') {
        return isOccupationFormEmpty(answer)
    }

    if (['autocomplete', 'select'].includes(question.type) && Array.isArray(value)) {
        return value.length === 0;
    }

    if (['autocomplete', 'select', 'image_picker', 'radio', 'checkbox'].includes(question.type)) {
        return typeof value === 'undefined'   
    }

    return !value
}