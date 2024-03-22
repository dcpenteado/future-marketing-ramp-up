<template>
    <div class="menu-page">

        <v-card class="mb-4">
            <v-card-text class="d-flex">
                <v-row dense>
                    <v-col cols="12" sm="4" lg="3">
                        <v-btn block color="primary" @click="dialog = true">Novo site</v-btn>
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
                    <div class="d-flex flex-column align-center">
                        <v-progress-linear rounded height="8" :value="getFormResponseProgress(item)"></v-progress-linear>
                        <span style="font-weight: 600; font-size: 12px">{{ getFormResponseProgress(item) }}%</span>
                    </div>
                </template>

                <template v-slot:[`item.created`]="{ item }">
                    {{ $date.format(item.created) }}
                </template>

                <template v-slot:[`item.changed`]="{ item }">
                    {{ $date.format(item.changed) }}
                </template>

                <template v-slot:[`item.status`]="{ item }">
                    <app-form-status-chip :status="item.status" small />
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex">
                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon color="primary" @click="setUpdateStatus(item)">
                                    <v-icon v-bind="attrs" v-on="on">
                                        mdi-file-edit-outline
                                    </v-icon>
                                </v-btn>
                            </template>
                            <span>Editar status</span>
                        </v-tooltip>

                        <v-menu offset-y min-width="180">
                            <template #activator="{ on, attrs }">
                                <v-btn icon text v-bind="attrs" v-on="on" color="primary">
                                    <v-icon>
                                        mdi-dots-vertical
                                    </v-icon>
                                </v-btn>
                            </template>

                            <v-list dense class="py-0">
                                <v-list-item :to="{ name: 'FormResponseSingle', params: { formResponseId: item._id } }">
                                    <v-list-item-icon>
                                        <v-icon>mdi-clipboard-account-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Ver formulário</v-list-item-title>
                                </v-list-item>

                                <v-list-item :to="{ name: 'FormResponseTextList', params: { formResponseId: item._id } }">
                                    <v-list-item-icon>
                                        <v-icon>mdi-text-box-outline</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Ver textos</v-list-item-title>
                                </v-list-item>

                                <v-list-item @click="archiveItem(item)" dark class="error">
                                    <v-list-item-icon>
                                        <v-icon>mdi-archive</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-title>Arquivar</v-list-item-title>
                                </v-list-item>

                            </v-list>

                        </v-menu>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <dialog-or-bottom-sheet v-model="dialog" max-width="500">
            <v-card>
                <v-form @submit.prevent="submit">

                    <v-card-title>
                        Criar novo site
                    </v-card-title>
                    <v-card-subtitle>
                        Associe um formulário a um cliente para iniciar a criação do site
                    </v-card-subtitle>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete v-model="data.form" label="Formulário" outlined hide-details item-text="name" item-value="_id" :items="forms.items" :loading="forms.loading" />
                            </v-col>

                            <v-col cols="12">
                                <v-autocomplete v-model="data.client" label="Cliente" :item-text="getCustomerField" outlined hide-details item-value="_id" :items="clients.items" :loading="clients.loading">
                                    <template #item="{ item }">
                                        <v-list-item-content>
                                            <v-list-item-title v-html="item.name" />
                                            <v-list-item-subtitle v-html="item.email" />
                                        </v-list-item-content>
                                    </template>
                                </v-autocomplete>
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
        
        <dialog-or-bottom-sheet v-model="statusUpdate.dialog" max-width="500">
            <v-card>
                <v-form @submit.prevent="updateStatus">

                    <v-card-title>
                        Atualizar status
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-select
                                    v-model="statusUpdate.status"
                                    label="Status"
                                    outlined
                                    hide-details
                                    :items="statusOptions"
                                >

                                    <template #selection="{ item }">
                                        <app-form-status-chip :status="item" small />
                                    </template>
                                    
                                    <template #item="{ item }">
                                        <app-form-status-chip :status="item" small />
                                    </template>
                            
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="error" :disabled="statusUpdate.saving" @click="statusUpdate.dialog = false">Cancelar</v-btn>
                        <v-btn color="primary" :loading="statusUpdate.saving" type="submit">Salvar</v-btn>
                    </v-card-actions>
                </v-form>
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
                sortable: false,
            },
            {
                text: 'Status',
                value: 'status',
            },
            {
                text: 'Data de criação',
                value: 'created',
            },
            {
                text: 'Última atualização',
                value: 'changed',
                sortable: false,
            },
            {
                text: 'Ações',
                value: 'actions',
                sortable: false,
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
        statusUpdate: {
            _id: null,
            status: null,
            dialog: false,
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
        },
        formResponseEnum(){
            return this.$store.state.formResponseEnum
        },
        statusOptions(){
            return [
                this.formResponseEnum.FILLING,
                this.formResponseEnum.FILLING_DONE,
                this.formResponseEnum.REVIEW,
                this.formResponseEnum.REVIEWED,
                this.formResponseEnum.APPROVED,
                this.formResponseEnum.FINISHED
            ]
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
        async archiveItem(item) {
            const value = await this.$store.dispatch('confirmDialog', {
                title: 'Arquivar',
                message: 'Deseja realmente arquivar esse site?'
            })

            if (!value) return

            const response = await this.$api.createOrUpdateFormResponse({
                ...item,
                filed: true
            })

            if (response.error) {
                return
            }

            this.$toast('success', 'Formulário arquivado com sucesso')

            await this.load()
        },
        getCustomerField(item) {
            if(!item) return '';
            return `${item.name} ${item.email}`;
        },
        setUpdateStatus(formResponse){
            this.statusUpdate._id = formResponse._id
            this.statusUpdate.status = formResponse.status
            this.statusUpdate.dialog = true
        },
        async updateStatus() {
            this.statusUpdate.saving = true

            const response = await this.$api.setFormResponseStatus(this.statusUpdate._id, this.statusUpdate.status)

            if (response.error) {
                this.statusUpdate.saving = false
                return
            }

            
            setTimeout(() => {
                this.statusUpdate.saving = false
                this.statusUpdate.dialog = false
                this.$toast('success', 'Status atualizado com sucesso')
            }, 500)

            await this.load()
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
        'statusUpdate.dialog'(value) {
            if (!value) {
                this.statusUpdate._id = null
                this.statusUpdate.status = null
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