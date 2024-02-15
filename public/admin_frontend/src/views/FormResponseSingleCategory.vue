<template>
    <v-form @submit.prevent="submit" style="padding-bottom: 10rem;" class="menu-page">
        <v-card class="progress-container mb-10">
            <v-card-text>
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <div class="title font-weight-bold">
                            Progresso atual ({{ progress }}%)
                        </div>
                    </v-col>

                    <v-col cols="12" sm="6" class="d-flex justify-sm-end">
                        <v-btn color="error" class="mr-2" :disabled="saving" @click="goToForm">
                            Cancelar
                        </v-btn>
    
                        <v-btn color="primary" type="submit" :loading="saving">
                            Salvar
                        </v-btn>
                    </v-col>

                    <v-col cols="12">
                        <v-progress-linear :value="progress" height="25" />
                    </v-col>

                </v-row>

            </v-card-text>
        </v-card>

        <dynamic-form ref="dynamicForm" v-model="data" :questions="questions" :answers="answers" />

        <dialog-or-bottom-sheet v-model="errorDialog" max-width="500">
            <v-card>
                <v-card-title>
                    Há erros no formulário
                </v-card-title>
                <v-card-text>
                    Alguns campos não foram preenchidos corretamente. Deseja salvar mesmo assim?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="errorDialog = false">
                        Fechar
                    </v-btn>
                    <v-btn color="primary" @click="save">
                        Salvar mesmo assim
                    </v-btn>
                </v-card-actions>
            </v-card>
        </dialog-or-bottom-sheet>

    </v-form>
</template>

<script>
import { getFormProgress } from "@/composables/getFormProgress";
import { isFieldEmpty } from "@/composables/isFieldEmpty";
// import { isFieldEmpty } from "@/composables/isFieldEmpty";
import Api from "@/lib/Api";
// import uuid from 'uuid-random';	

export default {
    name: 'FormCategory',
    data: () => ({
        formResponse: null,
        saving: false,
        errorDialog: false,
        progress: 0,
        data: []
    }),
    components: {
        DynamicForm: () => import('@/components/DynamicForm.vue'),
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
        currentUser() {
            return this.$store.state.currentUser
        },
        formId() {
            return this.$route.params.formId
        },
        categoryId() {
            return this.$route.params.categoryId
        },
        category() {
            return this.form?.categories?.find(c => c.id === this.categoryId) || null
        },
        questions() {
            return this.category?.questions || []
        },
        answers() {
            return this.formResponse?.answers || []
        },
        form() {
            return this.formResponse?.form || null
        },
    },
    watch: {
        category(value) {
            if (!value) return;

            this.setPageData();
        },
        data: {
            handler: 'setProgress',
            deep: true,
            immediate: true
        }
    },
    methods: {
        setProgress() {
            const tmpAnswers = this.data.map(a => {
                return {
                    question_id: a.question_id,
                    versions: [a]
                }
            })

            this.progress = getFormProgress(this.questions, tmpAnswers)
        },
        setPageData() {
            this.$store.commit('setPageTitle', this.category.name);
            this.$store.commit('setPageSubtitle', this.category.description);

            this.$store.commit('setBreadcrumbs', [
                {
                    label: this.form.name,
                    to: {
                        name: 'FormResponseSingle',
                        params: {
                            formResponseId: this.formResponse._id
                        }
                    }
                },
                {
                    label: this.category.name,
                },
            ])
        },
        setData() {
            this.data = this.questions.map(q => {
                let value = undefined;
                let markedAsEmpty = false;

                const answer = this.answers.find(a => a.question_id === q.id);

                if (answer && answer.versions.length) {
                    const lastVersion = answer.versions.at(-1)

                    value = lastVersion.value;
                    markedAsEmpty = lastVersion.markedAsEmpty;
                }

                return {
                    value,
                    markedAsEmpty,
                    question_id: q.id,
                    category_id: this.category.id
                }
            });
        },
        goToForm() {
            this.$router.push({
                name: 'FormResponseSingle',
                params: {
                    formResponseId: this.formResponse._id
                }
            })
        },
        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseById(this.$route.params.formResponseId);

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            this.formResponse = response.message;

            this.setData();

            setTimeout(() => {
                this.pageLoading = false;
            }, 200);
        },
        submit(){
            const errors = this.$refs.dynamicForm.validate();

            if (errors?.length) {
                this.errorDialog = true;
                return;
            }

            this.save()
        },
        async save() {
            this.saving = true;

            const data = JSON.parse(JSON.stringify(this.data)).filter(a => {

                if (a.markedAsEmpty) return true;

                const question = this.questions.find(q => q.id === a.question_id);

                if (!question) return false;

                return !isFieldEmpty(question, a);
            })

            const response = await this.$api.createFormResponseAnswers(this.formResponse._id, data);

            if (response.error) {
                this.saving = false;
                return;
            }

            this.$toast('success', 'Salvo com sucesso');

            this.saving = false;

            this.goToForm()
        }
    },
    mounted() {
        this.load()
    }
};
</script>

<style scoped>
.progress-container {
    position: sticky;
    top: 0;
    z-index: 1;
    width: auto;
}
</style>