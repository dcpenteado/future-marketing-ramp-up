<template>
    <v-row> 
        <v-col cols="12" v-for="(q) in questions" :key="q.id">
            <DynamicFormField v-model="model[q.id]" :question="q">
                <template #append-field-header>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary" outlined class="mr-4"
                        @click="showAnswerVersions(q.id)"
                    >
                        Ver versões
                    </v-btn>
                </template>
            </DynamicFormField>
        </v-col>

        <v-navigation-drawer
            v-model="drawer"
            right
            app
            width="500"
            temporary
        >

            <v-card-text v-if="selectedQuestion">
                <v-row class="overflow-y-auto">
                    <v-col cols="12" v-for="(a, i) in answerVersions" :key="a.id">
                        <v-card outlined>
                            <v-card-title>
                                Versão {{ i }}
                            </v-card-title>
                            <v-card-subtitle>
                                Origin: {{ a.origin }}
                            </v-card-subtitle>

                            <v-divider />
                            
                            <v-card-text style="pointer-events:none;opacity: .75;">
                                <DynamicFormFieldText
                                    :value="a.value"
                                    :question="selectedQuestion"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        
        </v-navigation-drawer>
    </v-row>
</template>

<script>
export default {
    name: 'DynamicForm',
    components: {
        DynamicFormField: () => import('@/components/DynamicFormField.vue'),
        
    },
    props: {
        value: {
            type: Object,
            required: true        
        },
        questions: {
            type: Array,
            required: true
        },
        answers: {
            type: Array,
            required: true
        },
    },
    data: () => ({
        fieldValidationsFunctions: [],
        drawer: false,
        selectedQuestionId: null
    }),
    provide() {
        return {
            fieldValidationsFunctions: this.fieldValidationsFunctions
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        selectedQuestion(){
            if (!this.selectedQuestionId) return [];

            return this.questions.find(q => q.id === this.selectedQuestionId);
        },
        answerVersions(){
            if (!this.selectedQuestionId) return [];

            return this.answers.filter(a => a.question_id === this.selectedQuestionId);
        },
    },
    watch: {
        drawer(value) {
            if (value) {
                document.querySelector('html').style.overflow = 'hidden';
                return
            }

            document.querySelector('html').style.overflow = 'auto';
        }
    },
    methods: {
        validate(){
            const errors = this.fieldValidationsFunctions
                .map(fn => fn())
                .reduce((acc, val) => acc.concat(val), []);

            return errors;
        },
        showAnswerVersions(questionId){
            this.selectedQuestionId = questionId;
            this.drawer = true;
        }
    }
}
</script>