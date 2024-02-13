<template>
    <v-autocomplete
        v-model="model.value"
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
        :disabled="!canFill"
        :placeholder="placeholder"
    />
</template>

<script>

import template from 'lodash/template'

export default {
    name: 'DynamicFormFieldAutocomplete',
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
    inject: ['currentAnswers'],
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
        placeholder() {
            return this.question.config?.placeholder || 'Selecione um item';
        },
        isMultiple(){
            return !!this.question.config.multiple;
        },
        canFill(){
            const dependsOn = this.question.config.dependsOn || [];

            if (dependsOn.length && !dependsOn.every(key => !!this.currentAnswers[key])) {
                return false;
            }

            return true
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

            const items = this.mode === 'api' ? this.fetchItems : this.question.config?.items || [];

            if (this.question.config?.filter) {
                return items.filter(i => this.filterItems(this.question.config.filter, i));
            }

            return items
        }
    },
    watch: {
        'items': function (  ) {
            const isInList = this.items.some(item => item[this.itemValue] === this.model.value);

            if (!isInList) {
                this.clear();
            }
        },
        canFill: {
            immediate: true,
            handler(){
                if (!this.canFill && this.model.value) {
                    this.clear();
                }
            }
        }
    },
    methods: {
        clear(){
            this.model.value = this.isMultiple ? [] : '';
        },
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
        },
        filterItems(config, item){

            const keys = Object.keys(config);

            return keys.every(key => {

                let value = config[key];

                if (value.includes('{{')) {
                    const compiled = template(value, {
                        interpolate: /{{([\s\S]+?)}}/g
                    });
                    
                    value = compiled({ currentAnswers: this.currentAnswers })
                }

                return item[key] === value
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