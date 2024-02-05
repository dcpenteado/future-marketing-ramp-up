<template>
    <div v-if="form">
        <v-card class="mb-4" outlined>
            <v-card-title>
                Progresso geral ({{ fullProgress }}%)
            </v-card-title>
            
            <v-card-text>
                <v-progress-linear :value="fullProgress" height="25" rounded  />
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
                        <v-card
                            outlined
                            hover
                            :to="category.to"
                        >
                            <v-card-text class="d-flex align-center">
                                <div class=" text-subtitle">
                                    {{ category.label }}
                                </div>
                                
                                <div class="flex-grow-1 mx-4">
                                    <v-progress-linear rounded :value="category.progress" height="20">
                                        <template v-slot:default="{ value }">
                                            <div class="text-caption">{{ Math.ceil(value) }}%</div>
                                        </template>
                                    </v-progress-linear>
                                </div>

                                <div>
                                    <v-icon color="mercury" >mdi-chevron-right</v-icon>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
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
                    .filter(a => c.questions.some(q => q.id === a.question_id))
                    .filter(a => a.current)
                    .filter(a => !!a.value)
                    .length

                const progress = Math.min((answeredLength / questionLength) * 100, 100)

                return {
                    label: `${c.name} (${answeredLength}/${questionLength})`,
                    progress: progress,
                    to: `/forms/${this.form._id}/categories/${c.id}`
                }
            })
        },
        fullProgress(){
            if (!this.form) return 0

            const questionsLength = this.form.categories.reduce((acc, c) => acc + c.questions.length, 0)
            const answeredLength = this.answers.filter(a => a.current).length

            return Math.round( Math.min((answeredLength / questionsLength) * 100, 100))
        }
    },
    methods: {
        setPageData(){
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
            }, 800);
        },
    },
    mounted(){
        this.load()
    }
};
</script>