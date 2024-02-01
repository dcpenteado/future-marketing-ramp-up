<template>
    <div>
        <v-card class="mb-4" outlined>
            <v-card-title>
                Progresso da categoria ({{ progress }}%)
            </v-card-title>
            
            <v-card-text>
                <v-progress-linear :value="progress" height="25"  />
            </v-card-text>
        </v-card>

        <dynamic-form
            :questions="questions"
            :answers="questions"
        />
        
    </div>
</template>

<script>
import Api from "@/lib/Api";

export default {
    name: 'FormCategory',
    data: () => ({
        progress: 30,
        form: null,
        category: null,
        answers: [],
        questions: []
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