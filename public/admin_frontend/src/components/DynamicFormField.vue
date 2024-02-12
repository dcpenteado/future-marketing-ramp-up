<template>
    <v-card
        v-show="show"
        :style="{
            'border-color': errors.length ? 'red' : undefined,            
        }"
    >
    <slot name="header">
        <v-row no-gutters align="center">
            <v-col cols="12" sm="8" >
                <v-card-title
                    class="break-words"
                    :class="errors.length ? 'error--text' : ''"
                >
                    {{ question.name }}
                </v-card-title>
        
                <v-card-subtitle
                    class="break-words"
                    :class="errors.length ? 'error--text' : ''"
                >
                    {{ question.description }}
                </v-card-subtitle>
            </v-col>

            <v-col class="d-flex align-center">
                
                    <slot name="header-actions" />
                
            </v-col>

        </v-row>        
    </slot>

    <v-divider />
        
        <v-card-text
            :style="{
                'pointer-events': disabled ? 'none' : 'auto',
                'opacity': disabled ? '0.5' : '1'
            }"
        >
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
                :disabled="disabled"
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

            <DynamicFormFieldTextarea
                v-else-if="question.type === 'textarea'"
                v-model="model"
                :question="question"
                :errors="errors"
            />

            <DynamicFormFieldTestimonials
                v-else-if="question.type === 'testimonials'"
                v-model="model"
                :question="question"
                :errors="errors"
                :disabled="disabled"
            />

            <DynamicFormFieldImageSelect
                v-else-if="question.type === 'image_select'"
                v-model="model"
                :question="question"
                :errors="errors"
                :disabled="disabled"
            />

            <DynamicFormFieldImagePicker
                v-else-if="question.type === 'image_picker'"
                v-model="model"
                :question="question"
                :errors="errors"
                :disabled="disabled"
            />

            <v-alert
                v-else
                outlined
                type="error"
            >
                Tipo de campo inválido {{ question.type }}
            </v-alert>
            

        </v-card-text>
    </v-card>
</template>

<script>
import { useValidation } from '@/composables/useValidation';

import template from 'lodash/template'

export default {
    name: 'DynamicFormField',
    components: {
        DynamicFormFieldText: () => import('@/components/DynamicFormFieldText.vue'),
        DynamicFormFieldSelect: () => import('@/components/DynamicFormFieldSelect.vue'),
        DynamicFormFieldAutocomplete: () => import('@/components/DynamicFormFieldAutocomplete.vue'),
        DynamicFormFieldListItem: () => import('@/components/DynamicFormFieldListItem.vue'),
        DynamicFormFieldRadio: () => import('@/components/DynamicFormFieldRadio.vue'),
        DynamicFormFieldCheckbox: () => import('@/components/DynamicFormFieldCheckbox.vue'),
        DynamicFormFieldTextarea: () => import('@/components/DynamicFormFieldTextarea.vue'),
        DynamicFormFieldTestimonials: () => import('@/components/DynamicFormFieldTestimonials.vue'),
        DynamicFormFieldImageSelect: () => import('@/components/DynamicFormFieldImageSelect.vue'),
        DynamicFormFieldImagePicker: () => import('@/components/DynamicFormFieldImagePicker.vue'),
    },
    props: {
        value: {
            // any type
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
        disabled: {
            type: Boolean,
            default: false
        }
    },
    inject: ['currentAnswers', 'fieldValidationsFunctions'],
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
        }
    },
    watch: {
        model: 'validate',
        currentAnswers: {
            handler: 'checkShow',
            deep: true
        }
    },
    methods: {
        validate(){
            const { validate } = useValidation(this.question);

            this.errors = validate(this.model);

            return this.errors
        },
        checkShow(){
            const operations = this.question.config?.if;

            if (!operations) {
                this.show = true;
                return
            }

            const results = operations
                .map(op => template(op, { interpolate: /{{([\s\S]+?)}}/g }))
                .map(compiled => compiled({ currentAnswers: this.currentAnswers }))
                .map(r => r === 'true')

            this.show = results.every(Boolean);

            console.log('config', results, results.every(Boolean));
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