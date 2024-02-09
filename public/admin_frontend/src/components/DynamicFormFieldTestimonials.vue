<template>
    <v-row v-if="model">
        <v-col v-for="(item, index) in items" :key="item.id" cols="12" class="mb-4">
            <v-card outlined>
                <v-card-title>
                    Depoimento {{ index + 1 }}
                </v-card-title>
                <v-card-text>
                    <v-row align="center">
                        <v-col cols="12" >
                            <v-text-field
                                v-model="model[index].name"
                                label="Nome"
                                outlined
                                hide-details
                            />
                        </v-col>
        
                        <v-col cols="12">
                            <v-textarea
                                v-model="model[index].description"
                                label="Descrição"
                                outlined
                                rows="1"
                                hide-details
                            />
                        </v-col>
        
                        <v-col cols="12">
                            <v-rating v-model="model[index].stars" hide-details/>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        v-if="!disabled"
                        @click="removeItem(index)"
                        color="error"
                        tabindex="-1"
                    >
                        Remover
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col v-if="!disabled" cols="12" :class="!items.length ? 'text-center' : ''">
            <v-btn color="primary" @click="addItem">
                Adicionar depoimento
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Array],
            default: null
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
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
        items() {
            if (!Array.isArray(this.model)) return []

            return this.model.map((item, index) => ({
                id: index,
                name: item.name,
                description: item.description,
            }))            
        },
    },
    methods: {
        addItem() {
            this.model.push({
                name: '',
                description: '',
                stars: 0
            })
        },
        removeItem(index) {
            this.model.splice(index, 1)
        }
    },
    mounted() {
        if (!Array.isArray(this.model) || !this.model) {
            this.model = []
        }
    },
}
</script>