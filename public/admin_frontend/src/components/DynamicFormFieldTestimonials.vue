<template>
    <v-row dense v-if="model">
        <v-col v-for="(item, index) in items" :key="item.id" cols="12">
            <v-row align="center">
                <v-col cols="3">
                    <v-text-field
                        v-model="model[index].name"
                        label="Nome"
                        outlined
                        hide-details
                    />
                </v-col>

                <v-col cols="6">
                    <v-textarea
                        v-model="model[index].description"
                        label="Descrição"
                        outlined
                        rows="1"
                        hide-details
                    />
                </v-col>

                <v-col cols="3" class="d-flex justify-end align-center">
                    <v-rating v-model="model[index].stars" hide-details/>

                    <v-btn
                        v-if="!disabled"
                        @click="removeItem(index)"
                        class="mx-2"
                        height="56"
                        text
                        color="error"
                        tabindex="-1"
                    >
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
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