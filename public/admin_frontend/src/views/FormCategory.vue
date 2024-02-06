<template>
    <v-form @submit.prevent="save" style="padding-bottom: 10rem;">
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
                        :disabled="saving"
                        @click="cancel"
                    >
                        Cancelar
                    </v-btn>

                    <v-btn
                        color="primary"
                        type="submit"
                        :loading="saving"
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
            :answers="answers"
        />
        
    </v-form>
</template>

<script>
import { isFieldEmpty } from "@/composables/isFieldEmpty";
import Api from "@/lib/Api";
// import uuid from 'uuid-random';	

export default {
    name: 'FormCategory',
    data: () => ({
        formResponse: null,
        form: null,
        category: null,
        saving: false,
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
            const answeredLength = this.questions.length
            
            const totalAnswers = Object.keys(this.dynamicFormData)
                .filter(k => {
                    const value = this.dynamicFormData[k];
                    const question = this.questions.find(q => q.id === k);
                    
                    return !isFieldEmpty(question, value);
                })
                .length;
            
            return Math.min((totalAnswers / answeredLength) * 100, 100)
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
        cancel(){
            this.$router.push('/form')
        },
        async load() {
            this.pageLoading = true;

            const response = await Api.getFormResponseByUserId(this.currentUser._id);

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            this.formResponse = response.message;

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
            }, 200);
        },
        async save(){
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

            this.$router.push('/form')
        }
    },
    mounted(){
        this.load()
    }
};
</script>