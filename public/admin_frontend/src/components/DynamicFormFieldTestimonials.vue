<template>
    <v-row v-if="model.value">
        <v-col v-for="(item, index) in items" :key="item.id" cols="12" class="mb-4">
            <v-card outlined>
                <v-card-title>
                    Depoimento {{ index + 1 }}
                </v-card-title>
                <v-card-text>
                    <v-row align="center">
                        <v-col cols="12" >
                            <v-text-field
                                v-model="model.value[index].name"
                                label="Nome"
                                outlined
                                hide-details
                                :readonly="readonly"
                            />
                        </v-col>
        
                        <v-col cols="12">
                            <v-textarea
                                v-model="model.value[index].description"
                                label="Descrição"
                                outlined
                                rows="1"
                                hide-details
                                :readonly="readonly"
                            />
                        </v-col>
        
                        <v-col cols="12">
                            <v-rating v-model="model.value[index].stars" hide-details :readonly="readonly"/>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-actions>
                    <v-btn
                        v-if="!readonly"
                        @click="removeItem(index)"
                        color="error"
                        tabindex="-1"
                    >
                        Remover
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>

        <v-col v-if="!readonly" cols="12" :class="!items.length ? 'text-center' : ''">
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
            type: Object,
            default: () => ({ value: null })
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        },
        readonly: {
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
            if (!Array.isArray(this.model.value)) return []

            return this.model.value.map((item, index) => ({
                id: index,
                name: item.name,
                description: item.description,
            }))            
        },
    },
    methods: {
        addItem() {
            this.model.value.push({
                name: '',
                description: '',
                stars: 0
            })
        },
        removeItem(index) {
            this.model.value.splice(index, 1)
        }
    },
    mounted() {
        if (!Array.isArray(this.model.value) || !this.model.value) {
            this.model.value = []
        }
    },
}
</script>