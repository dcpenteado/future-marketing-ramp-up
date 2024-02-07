<template>
    <div class="menu-page">

        <v-card class="mb-4">
            <v-card-text>
                <v-btn color="primary" @click="dialog = true">Associar Formulário</v-btn>
            </v-card-text>
        </v-card>

        <v-card>
            <v-data-table :headers="headers" :items="items">

                <template #[`item.progress`]="{ item }">
                    <v-progress-linear :value="getFormResponseProgress(item)" height="20" rounded>
                        <template v-slot:default="{ value }">
                            <div class="text-caption-total">{{ Math.ceil(value) }}%</div>
                        </template>
                    </v-progress-linear>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div>
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

    </div>
</template>

<script>
import { getFormProgress } from '@/composables/getFormProgress'

export default {
    data: () => ({
        dialog: false,
        items: [],
        headers: [
            {
                text: 'Cliente',
                value: 'user.name',
                width: '30%'
            },
            {
                text: 'Progresso',
                value: 'progress',
                width: '60%'
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
        }
    }),
    methods: {
        async setItems() {
            const response = await this.$api.getFormResponses()

            if (response.error) {
                return
            }

            this.items = response.message
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

            await this.setItems()

            setTimeout(() => {
                this.saving = false
                this.dialog = false
            }, 500)
        },
        getFormResponseProgress({ form, answers }) {
            const questions = form.categories.reduce((acc, c) => acc.concat(c.questions), [])

            return getFormProgress(questions, answers)
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
        }
    },
    mounted() {
        this.setItems()
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