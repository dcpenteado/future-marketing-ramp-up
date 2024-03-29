<template>
    <field-card
        v-show="show"
        :type="question.type"
        :error="!!errors.length"
        :readonly="!isEditable"        
    >

    <template #header>
        <slot name="header">
            <v-row align="start">
                <v-col cols="9">
                    <v-card-title
                        class="break-words pa-0 ma-0"
                        :class="errors.length ? 'error--text' : ''"
                    >
                        {{ question.name }}
                    </v-card-title>
            
                    <v-card-subtitle
                        class="break-words pa-0 ma-0"
                        :class="errors.length ? 'error--text' : ''"
                    >
                        {{ question.description }}
                    </v-card-subtitle>
                </v-col>
    
                <v-col cols="3">
                        <slot name="header-actions" />                
                    
                </v-col>
            </v-row>
        </slot>

    </template>

    <DynamicFormFieldAutocomplete
        v-if="question.type === 'autocomplete'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldCheckbox
        v-else-if="question.type === 'checkbox'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldImagePicker
        v-else-if="question.type === 'image_picker'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    /> 

    <DynamicFormFieldImageSelect
        v-else-if="question.type === 'image_select'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldListItem
        v-else-if="question.type === 'list_item'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldOccupationForm
        v-else-if="question.type === 'occupation_form'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldRadio
        v-else-if="question.type === 'radio'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldSelect
        v-else-if="question.type === 'select'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldTestimonials
        v-else-if="question.type === 'testimonials'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldText
        v-else-if="question.type === 'text'"
        v-model="model"
        :question="question"
        :errors="errors"
        :readonly="!isEditable"
    />

    <DynamicFormFieldTextarea
        v-else-if="question.type === 'textarea'"
        v-model="model"
        :question="question"
        :readonly="!isEditable"
        :errors="errors"
    />

    <v-alert
        v-else
        outlined
        type="error"
    >
        Tipo de campo inválido {{ question.type }}
    </v-alert>

        <template v-if="allowMarkAsEmpty" #footer>
            <v-checkbox
                v-model="model.markedAsEmpty"
                label="Marcar como vazio"
                :readonly="!isEditable"
                class="mt-0"
                hide-details
            />
        </template>

    </field-card>
</template>

<script>
import { useValidation } from '@/composables/useValidation';

import template from 'lodash/template'

export default {
    name: 'DynamicFormField',
    components: {
        DynamicFormFieldAutocomplete: () => import('@/components/DynamicFormFieldAutocomplete.vue'),
        DynamicFormFieldCheckbox: () => import('@/components/DynamicFormFieldCheckbox.vue'),
        DynamicFormFieldImagePicker: () => import('@/components/DynamicFormFieldImagePicker.vue'),
        DynamicFormFieldImageSelect: () => import('@/components/DynamicFormFieldImageSelect.vue'),
        DynamicFormFieldListItem: () => import('@/components/DynamicFormFieldListItem.vue'),
        DynamicFormFieldOccupationForm: () => import('@/components/DynamicFormFieldOccupationForm.vue'),
        DynamicFormFieldRadio: () => import('@/components/DynamicFormFieldRadio.vue'),
        DynamicFormFieldSelect: () => import('@/components/DynamicFormFieldSelect.vue'),
        DynamicFormFieldTestimonials: () => import('@/components/DynamicFormFieldTestimonials.vue'),
        DynamicFormFieldText: () => import('@/components/DynamicFormFieldText.vue'),
        DynamicFormFieldTextarea: () => import('@/components/DynamicFormFieldTextarea.vue'),
    },
    props: {
        value: {
            type: Object,
            default: () => ({
                value: null,
                markedAsEmpty: false
            })
        },
        question: {
            type: Object,
            required: true,
            default: () => ({
                name: 'Nome da pergunta',
                description: 'Descrição da pergunta',
                config: {}
            })
        },
        readonly: {
            type: Boolean,
            default: false
        },
        disableIfOperations: {
            type: Boolean,
            default: false
        },
        currentAnswers: {
            type: Object,
            default: () => ({})
        }
    },
    inject: ['fieldValidationsFunctions'],
    provide() {
        return {
            errors: this.errors
        }
    },
    data: () => ({
        show: true,
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
        },
        allowMarkAsEmpty(){
            return this.question.config?.allowMarkAsEmpty
        },
        isEditable(){
            return !this.readonly && !this.model.markedAsEmpty
        }
    },
    watch: {
        'model.value': 'validate',
        currentAnswers: {
            handler: 'checkShow',
            deep: true,
            immediate: true
        },
        'model.markedAsEmpty': function (value) {
            if (value) {
                this.model.value = null;
            }
        }
    },
    methods: {
        validate(){
            if (this.model.markedAsEmpty || !this.show || !this.isEditable) {
                this.errors = [];
                
                return this.errors
            }

            const { validate } = useValidation(this.question);

            this.errors = validate(this.model);

            return this.errors
        },
        checkShow(){
            const operations = this.question.config?.if;

            if (!operations || this.disableIfOperations) {
                this.show = true;
                return
            }


            const results = operations
                .map(op => template(op, { interpolate: /{{([\s\S]+?)}}/g }))
                .map(compiled => compiled({ currentAnswers: this.currentAnswers }))
                .map(r => r === 'true')

            this.show = results.every(Boolean);
        }
    },
    mounted(){
        this.fieldValidationsFunctions.push(this.validate);

        if (!this.model) {
            this.model = this.question.config?.default
        }
    },
    destroyed(){
        const index = this.fieldValidationsFunctions.indexOf(this.validate);

        if (index > -1) {
            this.fieldValidationsFunctions.splice(index, 1);
        }
    }
}
</script>