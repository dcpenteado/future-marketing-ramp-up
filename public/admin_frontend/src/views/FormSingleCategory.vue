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
export default {
    name: 'FormSingleCategory',
    data: () => ({
        progress: 30,
        answers: [],
        questions: [
            {
                id: "1",
                name: "question1",
                description: "Descrição da pergunta 1",
                type: "text",
                config: {
                    rules: [
                        { name: "required" }
                    ]                    
                }
            }
        ]
    }),
    components: {
        DynamicForm: () => import('@/components/DynamicForm.vue')
    },
    computed: {
        formId() {
            return this.$route.params.formId
        },
        categoryId() {
            return this.$route.params.categoryId
        },
    },
    methods: {
        submit() {

        },
    },
    mounted(){
        this.$store.commit('setBreadcrumbs', [
            {
                label: 'Formulário 1',
                to: `/forms/${this.formId}`
            },
            {
                label: 'Categoria 1',
                to: `/forms/${this.formId}/categories/${this.categoryId}`
            },
        ])
    }
};
</script>