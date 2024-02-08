<template>
    <v-row> 
        <v-col cols="12" v-for="(q) in questions" :key="q.id">
            <DynamicFormField v-model="model[q.id]" :question="q">
                <template #header-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        tabindex="-1"
                        color="primary"
                        outlined
                        class="mr-4"
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
                    <v-col cols="12" v-for="a in answerVersions" :key="a.id">
                        <DynamicFormField
                            :value="a.value"
                            :question="selectedQuestion"
                            disabled
                        >

                            <template #header>
                                <div class="d-flex align-center">
                                    <div>
                                        <v-card-title>
                                            {{ a.title }} - {{ a.origin }}
                                        </v-card-title>
                                        <v-card-subtitle>
                                            {{ a.date }}
                                        </v-card-subtitle>
                                    </div>
    
                                    <v-spacer></v-spacer>
    
                                    <v-btn color="primary" class="mr-4" @click="restoreVersion(a.value)">
                                        Restaurar
                                    </v-btn>
                                </div>

                            </template>
                    
                        </DynamicFormField>
                    </v-col>
                </v-row>
            </v-card-text>
        
        </v-navigation-drawer>
    </v-row>
</template>

<script>

import { format } from 'date-fns'

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
            fieldValidationsFunctions: this.fieldValidationsFunctions,
            currentAnswers: this.model
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

            const answer = this.answers.find(a => a.question_id === this.selectedQuestionId);

            if (!answer) return [];

            const versions = answer.versions.map((v, i) => {
                return {
                    title: `Versão ${i + 1}`,
                    value: v.value,
                    origin: v.origin,
                    date: format(new Date(v.createdAt), 'dd/MM/yyyy HH:mm')
                }
            });

            return versions.reverse();
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
        },
        restoreVersion(value){

            this.model = {
                ...this.model,
                [this.selectedQuestionId]: value
            }
            
            this.drawer = false;

            this.selectedQuestionId = null;

        }
    }
}
</script>