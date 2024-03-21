<template>
    <div class="menu-page">

        <v-card class="mb-4">
            <v-card-text class="d-flex">
                <v-row dense>
                    <v-col cols="12" sm="4" lg="3">
                        <v-btn block color="primary" @click="dialog = true">Associar Formulário</v-btn>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-text-field v-model="search" label="Pesquisar" outlined hide-details dense />
                    </v-col>
                </v-row>


            </v-card-text>
        </v-card>

        <v-card>
            <v-data-table :headers="headers" :items="filteredItems">

                <template #[`item.progress`]="{ item }">
                    {{ getFormResponseProgress(item) }}%
                </template>

                <template v-slot:[`item.created`]="{ item }">
                    {{ new Date(item.created).toLocaleString('pt-BR') }}
                </template>

                <template v-slot:[`item.changed`]="{ item }">
                    {{ new Date(item.changed).toLocaleString('pt-BR') }}
                </template>

                <template v-slot:[`item.status`]="{ item }">
                    {{ $store.state.form_response_statuses[item.status] }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex">
                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <router-link class="d-block" :to="{
                            name: 'FormResponseSingle',
                            params: {
                                formResponseId: item._id
                            }
                        }">
                                    <v-icon medium class="mr-4" color="primary" v-bind="attrs" v-on="on">
                                        mdi-eye
                                    </v-icon>
                                </router-link>
                            </template>
                            <span>Ver</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon medium class="mr-4" color="error" v-bind="attrs" v-on="on" @click="askToArchiveItem(item)">
                                    mdi-archive
                                </v-icon>
                            </template>
                            <span>Arquivar</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <dialog-or-bottom-sheet v-model="dialog" max-width="500">
            <v-card>
                <v-form @submit.prevent="submit">

                    <v-card-title>
                        Adicionar novo
                    </v-card-title>
                    <v-card-subtitle>
                        Associe um formulário a um cliente
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="data.form" label="Formulário" outlined hide-details item-text="name" item-value="_id" :items="forms.items" :loading="forms.loading" />
                            </v-col>

                            <v-col cols="12">
                                <v-autocomplete v-model="data.client" label="Cliente" outlined hide-details item-text="name" item-value="_id" :items="clients.items" :loading="clients.loading" />
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" :disabled="saving" @click="dialog = false">Cancelar</v-btn>
                        <v-btn color="primary" :loading="saving" type="submit">Associar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </dialog-or-bottom-sheet>

        <dialog-or-bottom-sheet v-model="archive.dialog" max-width="500">
            <v-card>
                <v-card-title>
                    Arquivar
                </v-card-title>
                <v-card-text>
                    Deseja realmente arquivar este formulário?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error" :disabled="archive.loading" @click="archive.dialog = false">Cancelar</v-btn>
                    <v-btn color="primary" :loading="archive.loading" @click="archiveItem(archive.itemId)">Arquivar</v-btn>
                </v-card-actions>
            </v-card>
        </dialog-or-bottom-sheet>

    </div>
</template>

<script>
import { getFormProgress } from '@/composables/getFormProgress'

export default {
    data: () => ({
        dialog: false,
        search: '',
        // items: [],
        headers: [
            {
                text: 'Cliente',
                value: 'user.name',
            },
            {
                text: 'Email',
                value: 'user.email',
            },
            {
                text: 'Progresso formulário',
                value: 'progress',
                sortable: false
            },
            {
                text: 'Status',
                value: 'status',
            },
            {
                text: 'Data de criação',
                value: 'created'
            },
            {
                text: 'Última atualização',
                value: 'changed',
                sortable: false
            },
            {
                text: '',
                value: 'actions',
            },
        ],
        clients: {
            loading: false,
            items: []
        },
        forms: {
            loading: false,
            items: []
        },
        saving: false,
        data: {
            form: null,
            client: null
        },
        archive: {
            loading: false,
            dialog: false,
            itemId: null
        }
    }),
    computed: {
        items() {
            return this.$store.state.formResponse.items
        },
        filteredItems() {
            if (!this.search) {
                return this.items
            }

            return this.items.filter(i => {
                const client = i.user.name.toLowerCase()
                const email = i.user.email.toLowerCase()
                const search = this.search.toLowerCase()

                return client.includes(search) || email.includes(search)
            })
        }
    },
    methods: {
        async load() {
            await this.$store.dispatch('formResponse/load')
        },
        async setClients() {
            this.clients.loading = true

            const response = await this.$api.getCustomers()

            if (response.error) {
                this.clients.loading = false
                return
            }

            this.clients.items = response.message

            setTimeout(() => {
                this.clients.loading = false
            }, 500)
        },
        async setForms() {
            this.forms.loading = true

            const response = await this.$api.getForms()

            if (response.error) {
                this.forms.loading = false
                return
            }

            this.forms.items = response.message

            setTimeout(() => {
                this.forms.loading = false
            }, 500)
        },
        async submit() {

            const hasForm = this.items.find(i => i.user._id === this.data.client)

            if (hasForm) {
                this.$toast('error', 'Este cliente já possui um formulário associado')
                this.dialog = false
                return
            }

            this.saving = true

            const response = await this.$api.createOrUpdateFormResponse({
                user: {
                    _id: this.data.client
                },
                form: {
                    _id: this.data.form
                }
            })

            if (response.error) {
                this.saving = false
                return
            }

            this.$toast('success', 'Formulário associado com sucesso')
            this.data.form = null
            this.data.client = null

            await this.load()

            setTimeout(() => {
                this.saving = false
                this.dialog = false
            }, 500)
        },
        getFormResponseProgress({ form, answers }) {
            const questions = form.categories.reduce((acc, c) => acc.concat(c.questions), [])

            return getFormProgress(questions, answers)
        },
        askToArchiveItem(item) {
            this.archive.itemId = item._id
            this.archive.dialog = true
        },
        async archiveItem() {
            this.archive.loading = true

            const item = this.items.find(i => i._id === this.archive.itemId)

            if (!item) {
                return
            }

            item.filed = true

            const response = await this.$api.createOrUpdateFormResponse(item)

            if (response.error) {
                this.archive.loading = false
                return
            }

            this.$toast('success', 'Formulário arquivado com sucesso')
            this.load()

            setTimeout(() => {
                this.archive.loading = false
                this.archive.dialog = false
            }, 500)
        }
    },
    watch: {
        dialog(value) {
            if (value && !this.clients.items.length) {
                this.setClients()
            }

            if (value && !this.forms.items.length) {
                this.setForms()
            }
        },
        'archive.dialog'(value) {
            if (!value) {
                this.archive.itemId = null
            }
        }
    },
    mounted() {
        this.load()
    }
}
</script>

<style scoped>
.text-caption-total {
    color: white;
    font-size: 14px;
    font-weight: 500;
}
</style>