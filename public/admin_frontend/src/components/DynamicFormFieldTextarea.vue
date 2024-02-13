<template>
    <v-textarea
        v-model="model.value"
        outlined
        hide-details="auto"
        :error="!!errors.length"
        :error-messages="errors"
        :placeholder="placeholder"
        :rows="rows"
    />
</template>

<script>
export default {
    name: 'DynamicFormFieldTextarea',
    props: {
        value: {
            type: Object,
            default: () => ({
                value: null
            })
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
            return this.question.config?.placeholder || 'Texto...';
        },
        rows() {
            return this.question.config?.rows || 5;
        }
    },
}
</script>