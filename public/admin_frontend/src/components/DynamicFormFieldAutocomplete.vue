<template>
    <DynamicFormField v-model="model" :question="question">
        <template v-slot:default="{ errors }">
            <v-autocomplete
                v-model="model"
                outlined
                hide-details="auto"
                clearable
                :item-text="itemText"
                :item-value="itemValue"
                :multiple="!!question.config.multiple"
                :items="items"
                :error="!!errors.length"
                :error-messages="errors"
                :loading="loading"
            />
        </template>
    </DynamicFormField>
</template>

<script>
export default {
    name: 'DynamicFormFieldAutocomplete',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),    
    },   
    props: {
        value: {
            type: [String, Array],
            default: ''
        },
        question: {
            type: Object,
            required: true
        },
    },
    data: () => ({
        loading: false,
        fetchItems: []
    }),
    computed: {
        mode(){
            return this.question.config?.mode || 'default';
        },
        itemText(){
            return this.question.config?.itemText || 'text';
        },
        itemValue(){
            return this.question.config?.itemValue || 'value';
        },
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        items(){
            if(this.mode === 'api'){
                return this.fetchItems;
            }

            return this.question.config?.items || [];
        }
    },
    methods: {
        fetchItemsFromApi(){
            const apiUrl = this.question.config?.url;

            if(!apiUrl) return

            if (this.fetchItems.length) return

            this.loading = true;

            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    this.fetchItems = data;
                }).finally(() => {
                    this.loading = false;
                });
        }
    },
    mounted(){
        if(this.mode === 'api'){
            this.fetchItemsFromApi();
        }
    }
}
</script>