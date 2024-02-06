<template>
    <div v-if="form">
        <v-card class="mb-4" outlined>
            <v-card-title>
                Progresso geral ({{ fullProgress }}%)
            </v-card-title>

            <v-card-text>
                <v-progress-linear :value="fullProgress" height="25" rounded />
            </v-card-text>
        </v-card>

        <v-card outlined v-if="!categories.length">
            <v-card-title>
                Nenhuma categoria encontrada
            </v-card-title>
        </v-card>

        <v-card outlined v-else>
            <v-card-title>
                Categorias
            </v-card-title>

            <v-card-text>
                <v-row>
                    <v-col v-for="(category, i) in categories" :key="i" cols="12">
                        <v-card outlined hover :to="category.to">


                            <v-card-text>
                                <v-row no-gutters>
                                    <v-col cols="12" class="mb-4 mb-md-0" md="2">
                                        <div class="text-subtitle">
                                            {{ category.label }}
                                        </div>
                                    </v-col>

                                    <v-col class="d-flex align-center">
                                        <v-progress-linear rounded :value="category.progress" height="20">
                                            <template v-slot:default="{ value }">
                                                <div class="text-caption">{{ Math.ceil(value) }}%</div>
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
import { isFieldEmpty } from "@/composables/isFieldEmpty";
import Api from "@/lib/Api";

export default {
    name: 'FormSingle',
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
        categories() {
            if (!this.form) return []

            return this.form.categories.map((c) => {
                const questionLength = c.questions.length

                const answeredLength = this.answers
                    .filter(a => a.category_id === c.id)
                    .filter(a => a.versions.length)
                    .filter(a => {
                        const question = c.questions.find(q => q.id === a.question_id);
                        const version = a.versions.at(-1);

                        return !isFieldEmpty(question, version.value);
                    })
                    .length

                const progress = Math.min((answeredLength / questionLength) * 100, 100)

                return {
                    label: `${c.name} (${answeredLength}/${questionLength})`,
                    progress: progress,
                    to: `/forms/${this.form._id}/categories/${c.id}`
                }
            })
        },
        fullProgress() {
            if (!this.form) return 0

            const questions = this.form.categories.reduce((acc, c) => acc.concat(c.questions), [])

            const answers = this.answers.filter(a => a.versions.length)
                .filter(a => {
                    const question = questions.find(q => q.id === a.question_id);

                    const version = a.versions.at(-1);

                    return !isFieldEmpty(question, version.value);
                })

            return Math.round(Math.min((answers.length / questions.length) * 100, 100))
        }
    },
    methods: {
        setPageData() {
            this.$store.commit('setPageTitle', this.form.name);

            this.$store.commit('setBreadcrumbs', [
                {
                    label: this.form.name,
                    to: '/form'
                },
            ])
        },
        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseByUserId(this.currentUser);

            if (response.error) {
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