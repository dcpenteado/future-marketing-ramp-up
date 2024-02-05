<template>
    <DynamicFormField v-model="model" :question="question">
        <template v-slot:default="{ errors }">
            
            <v-radio-group
                v-model="model"
                hide-details="auto"
                :error="!!errors.length"
                :error-messages="errors"
                class="mt-0"
            >

                <v-radio
                    v-for="(item, index) in items"
                    :key="index"
                    :label="item.text"
                    :value="item.value"
                ></v-radio>
        
            </v-radio-group>
        </template>
    </DynamicFormField>
</template>

<script>
export default {
    name: 'DynamicFormFieldText',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),    
    },
   
    props: {
        value: {
            type: String,
            default: ''
        },
        question: {
            type: Object,
            required: true
        },
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