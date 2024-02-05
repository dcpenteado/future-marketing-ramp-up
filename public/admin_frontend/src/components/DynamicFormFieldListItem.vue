<template>
    <DynamicFormField v-model="model" :question="question">
        <template v-slot:default="{ errors }">
            <v-row>
                <v-col cols="12" v-if="errors.length">
                    <v-alert type="error">
                        {{ errors[0] }}
                    </v-alert>
                </v-col>

                <v-col
                    cols="12" v-for="(i) in items" :key="i.id"
                    class="d-flex align-center"
                >
                    <v-text-field
                        v-model="model[i.id]" outlined hide-details="auto"
                        @blur="model = model"
                    />

                    <v-btn @click="removeItem(i.id)" class="mx-2" height="56">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-col>

                <v-col
                    cols="12"
                    :class="!items.length ? 'text-center' : ''"
                >
                    <v-btn color="primary" @click="addItem">
                        Adicionar item
                    </v-btn>
                </v-col>
            </v-row>
        </template>
    </DynamicFormField>
</template>

<script>
export default {
    name: 'DynamicFormFieldListItem',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),    
    },   
    props: {
        value: {
            type: [String, Array],
            default: null
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
                if (!Array.isArray(value)) {
                    this.$emit('input', value)
                    return
                }

                const onlyFilled = value.filter((item) => !!item)

                this.$emit('input', onlyFilled);
            }
        },
        items() {
            if (!Array.isArray(this.model)) return []

            return this.model.map((item, index) => ({
                id: index
            }))            
        },
    },
    methods: {
        addItem() {
            if (!Array.isArray(this.model)) {
                this.model = ['Item 1']
                return
            }

            this.model.push('item 1')
        },
        removeItem(index) {
            if (!Array.isArray(this.model)) {
                return
            }

            this.model.splice(index, 1)
        }
    },
}
</script>