<template>
    <div v-if="form" class="menu-page">
        <v-card class="mb-4">
            <v-card-title>
                Progresso geral ({{ fullProgress }}%)
            </v-card-title>

            <v-card-text>
                <v-progress-linear :value="fullProgress" height="40" rounded>
                    <template v-slot:default="{ value }">
                        <div class="text-caption-total">{{ Math.ceil(value) }}%</div>
                    </template>
                </v-progress-linear>
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

import Api from "@/lib/Api";

export default {
    name: 'FormResponseSingle',
    data: () => ({
        form: null,
        answers: [],
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
        categories() {
            if (!this.form?.categories) return []

            return this.form.categories.map((c) => {

                const categoryAnswers = this.answers.filter(a => a.category_id === c.id)

                const progress = getFormProgress(c.questions || [], categoryAnswers)

                return {
                    label: `${c.name} (${categoryAnswers.length}/${c.questions?.length || 0})`,
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
        fullProgress() {
            if (!this.form) return 0

            const questions = this.form.categories.reduce((acc, c) => acc.concat(c.questions) || [], [])

            return getFormProgress(questions, this.answers)
        }
    },
    methods: {
        setPageData() {
            this.$store.commit('setPageTitle', this.form.name);
            this.$store.commit('setPageSubtitle', this.form.description);

            this.$store.commit('setBreadcrumbs', [
                {
                    label: this.form.name,
                    to: '/form'
                },
            ])
        },
        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseById(this.$route.params.formResponseId);

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            const { form, answers } = response.message;

            this.form = form;
            this.answers = answers;

            this.setPageData();

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