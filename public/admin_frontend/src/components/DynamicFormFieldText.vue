<template>
    <v-text-field
        v-model="model.value"
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
                if (this.mask) {
                    return this.mask.masked(this.value || '')
                }

                return this.value;
            },
            set(value) {
                if (this.mask) {
                    this.$emit('input', this.mask.unmasked(value))
                    return
                }

                this.$emit('input', value);
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