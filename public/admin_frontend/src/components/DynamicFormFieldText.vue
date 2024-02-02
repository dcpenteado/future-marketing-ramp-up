<template>
    <DynamicFormField v-model="model" :question="question">
        <template v-slot:default="{ errors }">
            <v-text-field
                v-model="model"
                outlined
                hide-details="auto"
                :error="!!errors.length"
                :error-messages="errors"
            />
        </template>
    </DynamicFormField>
</template>

<script>
export default {
    name: 'DynamicFormFieldText',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),    
    },
   
    props: {
        value: {
            type: String,
            default: ''
        },
        question: {
            type: Object,
            required: true
        },
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
}
</script>