<template>
    <v-text-field
        v-model="text"
        outlined
        hide-details="auto"
        :placeholder="placeholder"
        :error="!!errors.length"
        :error-messages="errors"
        :title="question.name"
        :maxlength="maxlength"
        :prefix="question.config?.prefix"
        v-bind="question.config?.attrs"
    />
</template>

<script>

import { Mask } from "maska"

export default {
    name: 'DynamicFormFieldText',
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
        mask(){
            if (!this.question.config?.mask) return null

            return new Mask({
                mask: this.question.config.mask,
                eager: true,
            })
        },
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        text: {
            get() {
                if (this.mask) {
                    return this.mask.masked(this.model.value || '')
                }

                return this.model.value;
            },
            set(value) {
                if (this.mask) {
                    this.$set(this.model, 'value', this.mask.unmasked(value));
                    return
                }

                this.$set(this.model, 'value', value);
            }
        },
        placeholder() {
            return this.question.config?.placeholder || 'Texto...';
        },
        maxlength(){
            if (this.question.config?.mask) {
                return this.question.config.mask.length
            }

            return undefined
        }
    }
}
</script>