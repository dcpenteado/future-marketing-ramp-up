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

        <v-row>
            <v-col cols="12" v-if="!questions.length">
                <v-card class="mb-4" outlined>
                    <v-card-text class="text-center">
                        Sem perguntas cadastradas
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" v-for="(question, i) in questions" :key="i">
                <v-card class="mb-4" outlined>
                    <v-card-title>
                        {{ question.label }}
                    </v-card-title>
                    
                    <v-card-text>
                        <v-text-field
                            outlined
                            :label="question.label"
                            v-model="question.answer"
                        />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'FormSingleCategory',
    data: () => ({
        progress: 30,
        questions: []
    }),
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