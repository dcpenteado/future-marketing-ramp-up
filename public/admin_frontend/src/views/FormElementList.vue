<template>
    <div class="menu-page">

        <v-card class="mb-4">
            <v-card-text class="d-flex">

                <v-btn color="primary" @click="dialog = true" >Novo Elemento</v-btn>

            </v-card-text>
        </v-card>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="items"
            >

                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                icon
                                text
                                color="primary"
                                @click="editItem(item)"
                            >

                                <v-icon medium>
                                    mdi-file-edit-outline
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>

                    <v-tooltip left>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn
                                v-bind="attrs"
                                v-on="on"
                                icon
                                text
                                color="error"
                                @click="deleteItem(item)"
                            >

                                <v-icon medium>
                                    mdi-trash-can-outline
                                </v-icon>
                            </v-btn>
                        </template>
                        <span>Apagar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>

        <dialog-or-bottom-sheet
            v-model="dialog"
            max-width="500"
        >
            <v-form @submit.prevent="submit">
                <v-card>
                    <v-card-title>
                        {{ payload._id ? 'Editar' : 'Novo' }}
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field
                                    v-model="payload.id"
                                    label="ID"
                                    outlined
                                    hide-details="auto"
                                />
                            </v-col>
                            
                            <v-col cols="12">
                                <v-text-field
                                    v-model="payload.description"
                                    label="Descrição"
                                    outlined
                                    hide-details="auto"
                                />
                            </v-col>
                            
                            <v-col cols="12">
                                <v-select
                                    v-model="payload.type"
                                    label="Tipo"
                                    outlined
                                    hide-details="auto"
                                    item-text="text"
                                    item-value="value"
                                    :items="types"

                                />
                            </v-col>

                            <template v-if="payload.type === 'prompt'">
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="payload.max_tokens"
                                        label="Max tokens"
                                        type="number"
                                        outlined
                                        hide-details="auto"
                                        item-text="text"
                                        item-value="value"
                                    />
                                </v-col>
                                
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="payload.temperature"
                                        label="Temperatura"
                                        type="number"
                                        outlined
                                        hide-details="auto"
                                        item-text="text"
                                        item-value="value"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                    />
                                </v-col>
                            </template>

                            <v-col cols="12">
                                <tip-tap-editor
                                    v-if="!tiptap.loading"
                                    v-model="payload.content"
                                    :extensions="tiptap.extensions"
                                    :messages="[
                                        'Digite @ para usar a referência de uma pergunta.'
                                    ]"
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="error"
                            :disabled="saving"
                            @click="dialog = false"
                        >
                            Cancelar
                        </v-btn>
                        <v-btn
                            color="primary"
                            type="submit"
                            :loading="saving"
                        >
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </dialog-or-bottom-sheet>
    </div>
</template>

<script>

import { createMentionExtension } from '@/composables/mention';

export default {
    name: 'FormElementList',
    data() {
        return {
            form: null,
            dialog: false,
            saving: false,
            items: [],
            tiptap: {
                loading: false,
                extensions: [],
            },
            payload: {
                id: '',
                description: '',
                content: null,
                max_tokens: 1000,
                temperature: 0.7,
            },
            types: [
                {
                    text: 'Texto',
                    value: 'text'
                },
                {
                    text: 'Prompt',
                    value: 'prompt'
                }
            ],
            headers: [
                {
                    text: 'ID',
                    value: 'id'
                },
                {
                    text: 'type',
                    value: 'type'
                },
                {
                    text: 'Descrição',
                    value: 'description'
                },
                {
                    text: '',
                    value: 'actions'
                },
            ]
        }
    },
    computed: {
        pageLoading: {
            get() {
                return this.$store.state.pageLoading;
            },
            set(value) {
                this.$store.commit('setPageLoading', value);
            }
        },
        questions(){
            if (!this.form?.categories) return

            return this.form.categories.reduce((acc, c) => acc.concat(c.questions), [])
        },
    },
    methods: {
        async setItems(){
            const response = await this.$api.getRampUpElementsByFormId(this.$route.params.formId);

            if (response.error) return;

            this.items = response.message;
        },
        async setForm() {
            const response = await this.$api.getFormById(this.$route.params.formId);

            if (response.error) return;

            this.form = response.message;
        },
        setTiptap() {
            this.tiptap.loading = true

            const items = this.questions.map(q => q.id)

            this.tiptap.extensions = [
                createMentionExtension(items)
            ]

            this.tiptap.loading = false
        },
        async load() {
            this.pageLoading = true;

            await this.setItems();

            await this.setForm();

            this.setTiptap();

            this.pageLoading = false;
        },
        async submit(){
            this.saving = true;

            const response = await this.$api.createOrUpdateRampUpElement({
                ...this.payload,
                form: {
                    _id: this.$route.params.formId
                },
            })

            if (response.error) {
                this.saving = false;
                return
            }

            await this.setItems();

            this.$toast('success', 'Salvo com sucesso!')

            setTimeout(() => {
                this.dialog = false;
                this.saving = false;
            }, 500)
        },
        editItem(item) {
            this.payload = JSON.parse(JSON.stringify(item));

            this.dialog = true
        },
        async deleteItem(item) {
            const value = await this.$store.dispatch('confirmDialog')

            if (!value) return

            const response = await this.$api.createOrUpdateRampUpElement({
                ...item,
                filed: true
            })

            if (response.error) return

            await this.setItems()

            this.$toast('success', 'Elemento apagado com sucesso')
        }
    },
    watch:{
        dialog(value) {
            if (!value) {
                this.payload = {
                    id: '',
                    description: '',
                    content: null,
                    max_tokens: 1000,
                    temperature: 0.7,
                }
            }
        }
    },
    created() {
        this.load();
    },
}
</script>