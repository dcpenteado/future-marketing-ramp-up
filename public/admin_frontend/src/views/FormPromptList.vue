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

                <template v-slot:[`item.category`]="{ item }">
                    {{ findCategoryById(item.category_id).name }}
                </template>

                <template v-slot:[`item.question`]="{ item }">
                    {{ findQuestionById(item.category_id, item.question_id).name }}
                </template>

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
            max-width="500"
        >
            <v-form>
                <v-card>
                    <v-card-title>
                        {{ payload._id ? 'Editar' : 'Novo' }}
                    </v-card-title>
                    <v-card-text>
                        <v-row>
                            <v-col cols="12">
                                <v-autocomplete
                                    v-model="payload.category_id"
                                    label="Categoria"
                                    outlined
                                    hide-details="auto"
                                    item-text="text"
                                    item-value="value"
                                    :items="categories"
                                />
                            </v-col>

                            <v-col cols="12">
                                <v-autocomplete
                                    v-model="payload.question_id"
                                    label="Pergunta"
                                    outlined
                                    hide-details="auto"
                                    item-text="text"
                                    item-value="value"
                                    :items="questions"
                                    :disabled="!payload.category_id"
                                />
                            </v-col>
                            
                            <v-col cols="12">
                                <v-text-field
                                    v-model="payload.max_tokens"
                                    label="Max tokens"
                                    type="number"
                                    outlined
                                    hide-details="auto"
                                    item-text="text"
                                    item-value="value"
                                    :disabled="!payload.question_id"
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
                                    :disabled="!payload.question_id"
                                />
                            </v-col>

                            <v-col cols="12">
                                <v-textarea
                                    v-model="payload.prompt"
                                    label="Prompt"
                                    outlined
                                    hide-details="auto"
                                    :disabled="!payload.question_id"
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
                            @click="submit"
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
export default {
    name: 'FormPromptList',
    data() {
        return {
            form: null,
            dialog: false,
            items: [],
            payload: {
                max_tokens: 1000,
                temperature: 0.7,
            },
            saving: false,
            headers: [
                {
                    text: 'Categoria',
                    value: 'category'
                },
                {
                    text: 'Pergunta',
                    value: 'question'
                },
                {
                    text: 'Max tokens',
                    value: 'max_tokens'
                },
                {
                    text: 'Temperatura',
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
        categories() {
            if (!this.form?.categories) return

            return this.form.categories.map(c => ({
                text: c.name,
                value: c.id
            }))
        },
        questions(){
            if (!this.form?.categories) return
            
            const category = this.form.categories.find(c => c.id === this.payload.category_id)

            if (!category) return []

            const questions = category.questions

            return questions.map(q => ({
                text: q.name,
                value: q.id
            }))
        }
    },
    methods: {
        setPageData() {
            this.$store.commit('setBreadcrumbs', [
                { label: 'Formulários', to: '/forms' },
                { label: this.form.name },
                { label: 'Prompts' },
            ])
        },
        async setForm() {
            const response = await this.$api.getFormById(this.$route.params.formId);

            if (response.error) return;

            this.form = response.message;
        },
        async setItems() {
            const response = await this.$api.getPromptsByFormId(this.$route.params.formId);

            if (response.error) return;

            this.items = response.message;
        },
        async load() {
            this.pageLoading = true;

            await this.setForm();

            await this.setItems();

            this.setPageData();

            this.pageLoading = false;
        },
        async submit() {

            const exists = this.items.find(i => i.category_id === this.payload.category_id && i.question_id === this.payload.question_id)

            if (exists) {
                this.$toast('error', 'Já existe um prompt para essa categoria e pergunta')
                return
            }

            this.saving = true

            const response = await this.$api.createOrUpdatePrompt({
                ...this.payload,
                form: {
                    _id: this.$route.params.formId
                }
            })

            if (response.error) {
                this.saving = false
                return
            }

            await this.setItems()

            setTimeout(() => {
                this.saving = false
                this.dialog = false
            }, 500)
        },
        findCategoryById(id) {
            return this.form.categories.find(c => c.id === id)
        },
        findQuestionById(categoryId, id) {
            const category = this.findCategoryById(categoryId)

            if (!category) return

            return category.questions.find(q => q.id === id)
        },
        editItem(item) {
            this.payload = Object.assign({}, item)

            this.dialog = true
        },
        async deleteItem(item) {
            const value = await this.$store.dispatch('confirmDialog')

            if (!value) return

            const response = await this.$api.createOrUpdatePrompt({
                ...item,
                filed: true
            })

            if (response.error) return

            await this.setItems()

            this.$toast('success', 'Prompt apagado com sucesso')
        }
    },
    watch: {
        dialog(value){

            if (value) return

            this.payload = {
                max_tokens: 1000,
                temperature: 0.7,
            }

        }
    },
    created() {
        this.load();
    },
}
</script>