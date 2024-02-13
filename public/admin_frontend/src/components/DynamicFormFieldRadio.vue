<template>
    <v-radio-group
        v-model="model.value"
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
        items(){
            return this.question.config?.items || [];
        }
    },
}
</script>