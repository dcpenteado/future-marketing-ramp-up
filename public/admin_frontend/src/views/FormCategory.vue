<template>
    <v-form @submit.prevent="save">
        <v-card class="mb-4" outlined>         
            <v-card-text>
                <div class="d-flex align-center mb-2">
                    <div class="title font-weight-bold">
                        Progresso atual ({{ progress }}%)
                    </div>
    
                    <v-spacer></v-spacer>
    
                    <v-btn
                        color="error"
                        class="mr-2"
                        @click="cancel"
                    >
                        Cancelar
                    </v-btn>

                    <v-btn
                        color="primary"
                        type="submit"
                    >
                        Salvar
                    </v-btn>
                </div>

                <v-progress-linear :value="progress" height="25"  />
            </v-card-text>
        </v-card>

        <dynamic-form
            ref="dynamicForm"
            v-model="dynamicFormData"
            :questions="questions"
            :answers="questions"
        />
        
    </v-form>
</template>

<script>
import Api from "@/lib/Api";

export default {
    name: 'FormCategory',
    data: () => ({
        form: null,
        category: null,
        answers: [],
        questions: [],
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
        progress(){
            const requiredQuestions = this.questions.filter(q => q.config?.rules?.some(r => r.name === 'required')).length;
            
            const totalAnswers = Object.keys(this.dynamicFormData)
                .filter(k => this.dynamicFormData[k]).length;
            
            return (totalAnswers / requiredQuestions) * 100;
        }
    },
    methods: {
        setPageData(){
            this.$store.commit('setPageTitle', this.category.name);

            this.$store.commit('setBreadcrumbs', [
                {
                    label: this.form.name,
                    to: '/form'
                },
                {
                    label: this.category.name,
                },
            ])
        },
        setDynamicFormData(){             
            this.dynamicFormData = this.answers.reduce((acc, a) => {
                acc[a.question_id] = a.value;
                return acc;
            }, {});
        },
        cancel(){
            this.$router.push('/form')
        },
        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseByUserId(this.currentUser);

            if (response.error) {
                this.$router.push('/404');
                return
            }

            const { form, answers } = response.message;
            
            const category = form.categories.find(c => c.id === this.categoryId);

            this.form = form;
            this.category = category;
            this.answers = answers;
            this.questions = category.questions;

            this.setPageData();
            this.setDynamicFormData();

            setTimeout(() => {
                this.pageLoading = false;
            }, 800);
        },
        save(){

            const errors = this.$refs.dynamicForm.validate();

            if (errors?.length) {
                this.$toast('error', 'Existem erros no formulário');
                return;
            }

            this.$toast('success', 'Salvo com sucesso');
        }
    },
    mounted(){
        this.load()
    }
};
</script>