<template>
    <v-textarea
        v-model="model"
        outlined
        hide-details="auto"
        :error="!!errors.length"
        :error-messages="errors"
        :placeholder="placeholder"
    />
</template>

<script>
export default {
    name: 'DynamicFormFieldTextarea',
    props: {
        value: {
            type: String,
            default: ''
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
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
        },
        placeholder() {
            return this.question.placeholder || 'Texto...';
        }
    },
}
</script>