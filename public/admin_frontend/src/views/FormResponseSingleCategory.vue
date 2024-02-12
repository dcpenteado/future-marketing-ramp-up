<template>
    <v-form @submit.prevent="save" style="padding-bottom: 10rem;" class="menu-page">
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

        <dynamic-form ref="dynamicForm" v-model="dynamicFormData" :questions="questions" :answers="answers" />

    </v-form>
</template>

<script>
import { getFormProgress } from "@/composables/getFormProgress";
// import { isFieldEmpty } from "@/composables/isFieldEmpty";
import Api from "@/lib/Api";
// import uuid from 'uuid-random';	

export default {
    name: 'FormCategory',
    data: () => ({
        formResponse: null,
        saving: false,
        progress: 0,
        dynamicFormData: {}
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
        // progress() {
        //     const tmpAnswers = Object.entries(this.dynamicFormData).map(([question_id, value]) => ({
        //         category_id: this.category.id,
        //         question_id,
        //         versions: [{ value }]
        //     }));

        //     return getFormProgress(this.questions, tmpAnswers)
        // }
    },
    watch: {
        category(value) {
            if (!value) return;

            this.setPageData();
        },
        dynamicFormData: {
            handler: 'setProgress',
            deep: true
        }
    },
    methods: {
        setProgress() {
            const tmpAnswers = Object.entries(this.dynamicFormData).map(([question_id, value]) => ({
                category_id: this.category.id,
                question_id,
                versions: [{ value }]
            }));

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
        setDynamicFormData() {
            this.questions.forEach(q => {
                let value = '';

                const answer = this.answers.find(a => a.question_id === q.id);

                if (answer && answer.versions.length) {
                    const lastVersion = answer.versions.at(-1)

                    value = lastVersion.value;
                }

                if (answer) {
                    this.$set(this.dynamicFormData, q.id, value);
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

            this.setDynamicFormData();

            setTimeout(() => {
                this.pageLoading = false;
            }, 200);
        },
        async save() {
            this.saving = true;

            const errors = this.$refs.dynamicForm.validate();

            if (errors?.length) {
                this.$toast('error', 'Existem erros no formulário');
                this.saving = false;
                return;
            }

            const data = JSON.parse(JSON.stringify(this.dynamicFormData));

            const answers = Object.entries(data).map(([question_id, value]) => ({
                category_id: this.category.id,
                question_id,
                value
            }));

            const response = await this.$api.createFormResponseAnswers(this.formResponse._id, answers);

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