<template>
    <v-row> 
        <v-col cols="12" v-for="(q) in questions" :key="q.id">
            <DynamicFormFieldText :question="q" />
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'DynamicForm',
    components: {
        DynamicFormFieldText: () => import('@/components/DynamicFormFieldText.vue'),        
    },
    props: {
        questions: {
            type: Array,
            required: true
        },
        answers: {
            type: Array,
            required: true
        }
    }
}
</script>