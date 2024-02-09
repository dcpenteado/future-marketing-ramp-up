<template>
    <v-radio-group
        v-model="model"
        hide-details="auto"
        :error="!!errors.length"
        :error-messages="errors"
        class="mt-0"
        :row="question.config?.row"
        :column="question.config?.column"
    >

        <v-radio
            v-for="(item, index) in items"
            :key="index"
            :label="item.text"
            :value="item.value"
        ></v-radio>

    </v-radio-group>
</template>

<script>
export default {
    name: 'DynamicFormFieldRadio',
    props: {
        value: {
            type: [String, Number, Boolean],
            default: null
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
        items(){
            return this.question.config?.items || [];
        }
    },
}
</script>