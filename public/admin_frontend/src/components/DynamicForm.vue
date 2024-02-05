<template>
    <v-row> 
        <v-col cols="12" v-for="(q) in questions" :key="q.id">
            <DynamicFormFieldText
                v-if="q.type === 'text'"
                v-model="model[q.id]"
                :question="q"
            />
            
            <DynamicFormFieldSelect
                v-else-if="q.type === 'select'"
                v-model="model[q.id]"
                :question="q"
            />
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'DynamicForm',
    components: {
        DynamicFormFieldText: () => import('@/components/DynamicFormFieldText.vue'),
        DynamicFormFieldSelect: () => import('@/components/DynamicFormFieldSelect.vue'),
    },
    props: {
        value: {
            type: Object,
            required: true        
        },
        questions: {
            type: Array,
            required: true
        },
        answers: {
            type: Array,
            required: true
        }
    },
    data: () => ({
        fieldValidationsFunctions: []
    }),
    provide() {
        return {
            fieldValidationsFunctions: this.fieldValidationsFunctions
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    methods: {
        validate(){
            const errors = this.fieldValidationsFunctions
                .map(fn => fn())
                .reduce((acc, val) => acc.concat(val), []);

            return errors;
        }
    }
}
</script>