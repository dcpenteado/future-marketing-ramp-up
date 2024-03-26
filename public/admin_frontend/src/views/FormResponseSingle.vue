<template>
    <div v-if="form" class="menu-page">
        <v-card class="mb-4">
            <v-card-title>
                Progresso geral ({{ fullProgress }}%)

            </v-card-title>

            <v-card-text>
                <v-progress-linear :value="fullProgress" v-if="!(fullProgress == 100 && status < 2)" height="40" rounded>
                    <template v-slot:default="{ value }">
                        <div class="text-caption-total">{{ Math.ceil(value) }}%</div>
                    </template>
                </v-progress-linear>
                <v-btn class="success mt-2" large v-if="fullProgress == 100 && status < 2" @click.native="completeForm">Enviar respostas</v-btn>
            </v-card-text>
        </v-card>

        <v-card v-if="!categories.length">
            <v-card-title>
                Nenhuma categoria encontrada
            </v-card-title>
        </v-card>

        <v-card v-else>
            <v-card-title>
                Categorias
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col v-for="(category, i) in categories" :key="i" cols="12">
                        <v-card outlined hover :to="category.to">

                            <v-card-text>
                                <v-row no-gutters align="center">
                                    <v-col cols="12" class="mb-4 mb-md-0" md="2">
                                        <div class="text-subtitle">
                                            {{ category.label }}
                                        </div>
                                    </v-col>

                                    <v-col class="d-flex align-center">
                                        <v-progress-linear rounded :value="category.progress" height="30">
                                            <template v-slot:default="{ value }">
                                                <div class="text-caption-category">{{ Math.ceil(value) }}%</div>
                                            </template>
                                        </v-progress-linear>

                                        <v-icon color="mercury" class="ml-2">mdi-chevron-right</v-icon>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
import { getFormProgress } from "@/composables/getFormProgress";
import { getFormRequiredQuestions } from "@/composables/getFormRequiredQuestions";

import Api from "@/lib/Api";

export default {
    name: 'FormResponseSingle',
    data: () => ({
        form: null,
        categories: [],
        answers: [],
        fullProgress: 0,
        status: 0,
        form_response_id: null
    }),
    computed: {
        pageLoading: {
            get() {
                return this.$store.state.pageLoading;
            },
            set(value) {
                this.$store.commit('setPageLoading', value);
            }
        },
        currentUser: {
            get() {
                return this.$store.state.currentUser;
            },
            set(value) {
                this.$store.commit('setCurrentUser', value);
            }
        },
        isAdmin() {
            return this.currentUser?.admin;
        },


    },
    methods: {
        setPageData() {
            this.$store.commit('setPageTitle', this.form.name);
            this.$store.commit('setPageSubtitle', this.form.description);

            this.$store.commit('setBreadcrumbs', [
                { label: this.form.name },
            ])
        },
        setCategories() {
            if (!this.form?.categories) return []

            this.categories = this.form.categories.map((c) => {

                const requiredQuestions = getFormRequiredQuestions(c.questions || [], this.answers)
                const categoryAnswers = this.answers
                    .filter(a => a.category_id === c.id)
                    .filter(a => requiredQuestions.some(q => q.id === a.question_id))

                const progress = getFormProgress(c.questions || [], categoryAnswers)

                return {
                    label: `${c.name} (${categoryAnswers.length}/${requiredQuestions.length || 0})`,
                    progress: progress,
                    to: {
                        name: 'FormResponseSingleCategory',
                        params: {
                            formResponseId: this.$route.params.formResponseId,
                            categoryId: c.id
                        }
                    }
                }
            })
        },
        async setFullProgress() {
            if (!this.form) return 0

            const questions = this.form.categories.reduce((acc, c) => acc.concat(c.questions) || [], [])

            this.fullProgress = getFormProgress(questions, this.answers)

            //STATUS NOVO, INICIOU O PREENCHIMENTO, MUDA STATUS PARA PREENCHENDO FORMULÁRIO (1) 
            if (this.fullProgress > 0 && this.status < 1) {
                await Api.setFormResponseStatus(this.form_response_id, 1);
                await this.load();
            }


        },

        async completeForm() {
            //STATUS PREENCHENDO FORMULÁRIO, TERMINOU O PREENCHIMENTO, MUDA STATUS PARA FORMULÁRIO PRONTO (2) 
            if (this.fullProgress == 100 && this.status < 2) {
                await Api.setFormResponseStatus(this.form_response_id, 2);
                await this.load();
            }
        },

        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseById(this.$route.params.formResponseId);

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            const { form, answers, status, _id } = response.message;

            this.form = form;
            this.answers = answers;
            this.status = status;
            this.form_response_id = _id;

            this.setPageData();
            this.setCategories();
            this.setFullProgress();

            setTimeout(() => {
                this.pageLoading = false;
            }, 200);
        },
    },
    mounted() {
        this.load()
    }
};
</script>

<style scoped>
.text-caption-category {
    color: white;
    font-size: 16px !important;
}

.text-caption-total {
    color: white;
    font-size: 18px;
}
</style>