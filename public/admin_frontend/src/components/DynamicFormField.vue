<template>
    <v-card
        outlined
        :style="{
            'border-color': errors.length ? 'red' : undefined,            
        }"
    >
        <v-card-title :class="errors.length ? 'error--text' : ''">
            {{ question.name }}
        </v-card-title>

        <v-card-subtitle :class="errors.length ? 'error--text' : ''">
            {{ question.description }}
        </v-card-subtitle>

        <v-divider />
        
        <v-card-text>
            <slot :errors="errors" />
        </v-card-text>
    </v-card>
</template>

<script>
import { useValidation } from '@/composables/useValidation';

export default {
    name: 'DynamicFormField',
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
    data: () => ({
        errors: [],
        rules: [],
        availableRules: {
            required: (v) => !!v || 'Campo obrigatório'
        }
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
        setRules(){
            if (!this.question.config?.rules) return;

            for (const ruleConfig of this.question.config.rules) {
                if (this.availableRules[ruleConfig.name]) {
                    this.rules.push(this.availableRules[ruleConfig.name]);
                }
            }
        },
        validate(){
            const { validate } = useValidation(this.question);

            this.errors = validate(this.model);

            return this.errors
        }
    },
    mounted(){
        this.setRules();

        this.fieldValidationsFunctions.push(this.validate);
    }
}
</script>