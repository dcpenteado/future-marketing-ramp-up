<template>
    <v-card
        outlined
        :style="{
            'border-color': errors.length ? 'red' : undefined,            
        }"
    >

    <div class="d-flex align-center">
        <div>
            <v-card-title :class="errors.length ? 'error--text' : ''">
                {{ question.name }}
            </v-card-title>
    
            <v-card-subtitle :class="errors.length ? 'error--text' : ''">
                {{ question.description }}
            </v-card-subtitle>
        </div>

        <slot name="append-field-header" :question="question" />
    </div>

        <v-divider />
        
        <v-card-text>
            <DynamicFormFieldText
                v-if="question.type === 'text'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldSelect
                v-else-if="question.type === 'select'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldListItem
                v-else-if="question.type === 'list_item'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldAutocomplete
                v-else-if="question.type === 'autocomplete'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldRadio
                v-else-if="question.type === 'radio'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldCheckbox
                v-else-if="question.type === 'checkbox'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

        </v-card-text>
    </v-card>
</template>

<script>
import { useValidation } from '@/composables/useValidation';

export default {
    name: 'DynamicFormField',
    components: {
        DynamicFormFieldText: () => import('@/components/DynamicFormFieldText.vue'),
        DynamicFormFieldSelect: () => import('@/components/DynamicFormFieldSelect.vue'),
        DynamicFormFieldAutocomplete: () => import('@/components/DynamicFormFieldAutocomplete.vue'),
        DynamicFormFieldListItem: () => import('@/components/DynamicFormFieldListItem.vue'),
        DynamicFormFieldRadio: () => import('@/components/DynamicFormFieldRadio.vue'),
        DynamicFormFieldCheckbox: () => import('@/components/DynamicFormFieldCheckbox.vue'),
    },
    props: {
        value: {
            type: [String, Number, Object, Array],
            default: null
        },
        question: {
            type: Object,
            required: true,
            default: () => ({
                name: 'Nome da pergunta',
                description: 'Descrição da pergunta'
            })
        },
    },
    inject: ['fieldValidationsFunctions'],
    provide() {
        return {
            errors: this.errors
        }
    },
    data: () => ({
        errors: [],
    }),
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
    watch: {
        model: 'validate'
    },
    methods: {
        validate(){
            const { validate } = useValidation(this.question);

            this.errors = validate(this.model);

            return this.errors
        }
    },
    mounted(){
        this.fieldValidationsFunctions.push(this.validate);
    }
}
</script>