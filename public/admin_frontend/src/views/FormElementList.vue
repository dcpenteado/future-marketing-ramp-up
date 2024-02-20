<template>
    <div class="menu-page">

        <v-card class="mb-4">
            <v-card-text class="d-flex">

                <v-btn color="primary" @click="dialog = true" >Novo prompt</v-btn>

            </v-card-text>
        </v-card>

        <v-card>
            <v-data-table
                :headers="headers"
                :items="items"
            >

                <template v-slot:[`item.prompt`]="{ item }">
                    <div class="text-truncate" style="max-width: 150px;" >
                        {{ item.prompt }}
                    </div>
                </template>

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
            max-width="1200"
        >
            <v-form>
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
                                <v-select
                                    v-model="payload.formResponse"
                                    label="Form response"
                                    outlined
                                    hide-details="auto"
                                    :items="formResponses"
                                    item-text="user.name"
                                    item-value="_id"
                                />
                            </v-col>
                            
                            <!-- <v-col cols="12">
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
                                    label="Temperature"
                                    type="number"
                                    outlined
                                    hide-details="auto"
                                    item-text="text"
                                    item-value="value"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                />
                            </v-col> -->

                            <v-col cols="4">
                                <tip-tap-editor
                                    v-if="!tiptap.loading"
                                    v-model="tiptap.data"
                                    label="Prompt"
                                    outlined
                                    hide-details="auto"
                                    :disabled="!payload.question_id"
                                    :extensions="tiptap.extensions"
                                />
                            </v-col>

                            <v-col cols="4">
                                <v-textarea
                                    v-model="json"
                                    readonly 
                                    label="JSON"
                                    outlined
                                    dense
                                    rows="20"
                                />
                            </v-col>
                            <v-col cols="4">
                                <v-textarea
                                    v-model="result"
                                    readonly 
                                    label="Resultado"
                                    outlined
                                    dense
                                    rows="20"
                                />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <!-- <v-card-actions>
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
                            @click="submit"
                            :loading="saving"
                        >
                            Salve
                        </v-btn>
                    </v-card-actions> -->
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
            formResponses: [],
            dialog: false,
            items: [],
            tiptap: {
                data: {
                    type: 'doc',
                    content: []
                },
                loading: false,
                extensions: [],
            },
            payload: {
                id: 'Test',
                formResponse: null,
                max_tokens: 1000,
                temperature: 0.7,
            },
            saving: false,
            headers: [
                {
                    text: 'Id',
                    value: 'id'
                },
                {
                    text: 'Max tokens',
                    value: 'max_tokens'
                },
                {
                    text: 'Temperature',
                    value: 'temperature'
                },
                {
                    text: 'Prompt',
                    value: 'prompt',
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
        json() {
            return JSON.stringify(this.tiptap.data, null, 4)
        },
        result() {
            const formResponse = this.formResponses.find(fr => fr._id === this.payload.formResponse)
            
            if (!formResponse) return

            if (!this.tiptap.data) return

            let text = this.tiptap.data.content.map(c => {
                if (c.type === 'text') return c.text

                if (c.type === 'mention') return `@${c.attrs.id}`

                if (c.type === 'paragraph' && !c.content?.length) return '\n'

                if (c.type === 'paragraph') {
                    return c.content.map(c => {
                        if (c.type === 'text') return c.text

                        if (c.type === 'mention') return `@${c.attrs.id}`
                    }).join('') + '\n'
                }

                return ''
            }).join('')

            this.questions.forEach(q => {
                const answer = formResponse.answers.find(a => a.question_id === q.id)
                
                if (!answer) return

                const version = answer.versions.at(-1)

                if (!version) return
                
                text = text.replaceAll(`@${q.id}`, version.value)
            })

            return text
        },
    },
    methods: {
        async setFormResponses() {
            const response = await this.$api.getFormResponses()

            if (response.error) {
                return
            }

            this.formResponses = response.message

            this.payload.formResponse = this.formResponses[0]?._id
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

            this.tiptap.data.content = [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Resumir o texto a seguir: '
                        },
                    ],
                },
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: 'Meu nome é ',
                        },
                        {
                            type: 'mention',
                            attrs: {
                                id: items[0],
                            },
                            text: `@${items[0]}`,
                        },

                        {
                            type: 'text',
                            text: 'e meu email é ',
                        },
                        {
                            type: 'mention',
                            attrs: {
                                id: items[1],
                            },
                            text: `@${items[1]}`,
                        },
                    ],
                }
            ]

            setTimeout(() => {
                this.tiptap.loading = false
            }, 1000)
        },
        async load() {
            this.pageLoading = true;

            await this.setForm();

            await this.setFormResponses();

            this.setTiptap();

            this.pageLoading = false;
        },
    },
    created() {
        this.load();
    },
}
</script>