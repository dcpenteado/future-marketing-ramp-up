<template>
    <v-checkbox
        v-model="model.value"
        hide-details="auto"
        :label="question.name"
        :error="!!errors.length"
        :error-messages="errors"
        :readonly="readonly"
        class="mt-0"
    >

    </v-checkbox>
</template>

<script>
export default {
    name: 'DynamicFormFieldCheckbox',
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
    },
}
</script>