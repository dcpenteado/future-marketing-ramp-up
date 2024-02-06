<template>
    <v-text-field
        v-model="model"
        outlined
        hide-details="auto"
        :error="!!errors.length"
        :error-messages="errors"
    />
</template>

<script>
export default {
    name: 'DynamicFormFieldText',
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
        }
    },
}
</script>