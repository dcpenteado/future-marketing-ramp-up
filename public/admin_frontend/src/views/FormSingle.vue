<template>
    <div>
        <v-card class="mb-4" outlined>
            <v-card-title>
                Progresso geral ({{ generalProgress }}%)
            </v-card-title>
            
            <v-card-text>
                <v-progress-linear :value="generalProgress" height="25" rounded  />
            </v-card-text>
        </v-card>

        <v-card outlined>
            <v-card-title>
                Categorias
            </v-card-title>
            
            <v-card-text>
                <v-row>
                    <v-col v-for="(category, i) in categories" :key="i" cols="12">
                        <v-card
                            outlined
                            hover
                            :to="`/forms/${$route.params.formId}/categories/${i}`"
                        >
                            <v-card-text class="d-flex align-center">
                                <div class=" text-subtitle-2">
                                    {{ category.label }} ({{ category.progress }}%)
                                </div>
                                
                                <div class="flex-grow-1 mx-4">
                                    <v-progress-linear rounded :value="category.progress" height="10"  />
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
export default {
    name: 'FormSingle',
    data: () => ({
        generalProgress: 30,
        categories: [
            {
                label: 'Categoria 1',
                progress: 15,
            },
            {
                label: 'Categoria 2',
                progress: 30,
            },
            {
                label: 'Categoria 3',
                progress: 25,
            },
        ],
    }),
    mounted(){
        this.$store.commit('setBreadcrumbs', [
            {
                label: 'Formulário 1',
                to: '/forms/1'
            },
        ])
    }
};
</script>