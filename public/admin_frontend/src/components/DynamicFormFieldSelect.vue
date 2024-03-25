<template>
    <v-select
        v-model="model.value"
        outlined
        hide-details="auto"
        item-text="text"
        item-value="value"
        clearable
        :placeholder="placeholder"
        :multiple="!!question.config.multiple"
        :items="question.config.items"
        :error="!!errors.length"
        :error-messages="errors"
        :readonly="readonly"
    />
</template>

<script>
export default {
    name: 'DynamicFormFieldSelect',
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
        },
        readonly: {
            type: Boolean,
            default: false
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
            return this.question.config?.placeholder || 'Selecione um item';
        }
    },
}
</script>