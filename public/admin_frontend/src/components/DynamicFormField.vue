<template>
    <v-card
        outlined
        :style="{
            'border-color': errors.length ? 'red' : undefined,            
        }"
    >
    <slot name="header">
        <div class="d-flex align-center">
            <div>
                <v-card-title :class="errors.length ? 'error--text' : ''">
                    {{ question.name }}
                </v-card-title>
        
                <v-card-subtitle :class="errors.length ? 'error--text' : ''">
                    {{ question.description }}
                </v-card-subtitle>
            </div>

            <slot name="header-actions" />
        </div>        
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

            
            <v-alert
                v-else
                outlined
                type="error"
            >
                Tipo de campo não suportado
            </v-alert>
            

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
        DynamicFormFieldTextarea: () => import('@/components/DynamicFormFieldTextarea.vue'),
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
        disabled: {
            type: Boolean,
            default: false
        }
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
    },
    destroyed(){
        const index = this.fieldValidationsFunctions.indexOf(this.validate);

        if (index > -1) {
            this.fieldValidationsFunctions.splice(index, 1);
        }
    }
}
</script>