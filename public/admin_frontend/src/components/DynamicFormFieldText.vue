<template>
    <DynamicFormField :question="question">
        <v-text-field outlined dense />
    </DynamicFormField>
</template>

<script>
export default {
    name: 'DynamicFormFieldText',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),    
    },
    props: {
        question: {
            type: Object,
            required: true
        },
    },
    methods: {
        updateAnswer(answer){
            console.log(answer)
        }
    }
}
</script>