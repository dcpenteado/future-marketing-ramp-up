<template>
    <v-row> 
        <v-col cols="12" v-for="(answer, i) in model" :key="answer.question_id">
            <DynamicFormField
                :value="answer"
                :question="questions.find(q => q.id === answer.question_id)"
                :currentAnswers="currentAnswers"
                :disabled="disabled"
                @input="model[i] = $event"
            >
                <template #header-actions>
                    <div class="d-flex">
                        <v-spacer ></v-spacer>
    
                        <v-tooltip bottom>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    tabindex="-1"
                                    icon
                                    v-on="on"
                                    @click="showAnswerVersions(answer.question_id)"
                                >
                                    <v-icon>mdi-history</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver versões</span>
    
                        </v-tooltip>
                    </div>
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

            <template v-slot:prepend>
                <div class="d-flex pa-4 align-center">
                    <v-toolbar-title>
                        Versões
                    </v-toolbar-title>
    
                    <v-spacer></v-spacer>
    
                    <v-btn
                        icon
                        @click="drawer = false"
    
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
                <v-divider></v-divider>
            </template>

            <v-card-text v-if="selectedQuestion" style="background-color: #2524380f;min-height:100%">
                <v-row class="overflow-y-auto">
                    <v-col cols="12" v-if="!answerVersions.length">
                        <v-card-title class="break-words">
                            Nenhuma versão encontrada
                        </v-card-title>
                    </v-col>
                    
                    <v-col cols="12" v-for="a in answerVersions" :key="a.id">
                        <DynamicFormField
                            :value="a"
                            :question="selectedQuestion"
                            disabled
                            disable-if-operations
                        >

                            <template #header>                                
                                <v-row dense align="center">
                                    <v-col cols="12" sm="6">                                            
                                        <v-card-title class="pa-0 ma-0">
                                            {{ a.title }} - {{ a.origin }}
                                        </v-card-title>
                                        <v-card-subtitle class="pa-0 ma-0">
                                            {{ a.date }}
                                        </v-card-subtitle>                                            
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-btn
                                            block
                                            color="primary"
                                            :disabled="disabled"
                                            @click="restoreVersion(a.value)"
                                        >
                                            Restaurar
                                        </v-btn>
                                    </v-col>    
                                </v-row>
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
            type: Array,
            required: true,
            default: () => ([])
        },
        questions: {
            type: Array,
            required: true
        },
        answers: {
            type: Array,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
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
            if (!this.selectedQuestionId) return null;

            return this.questions.find(q => q.id === this.selectedQuestionId);
        },
        currentAnswers(){
            return this.model.reduce((acc, val) => {
                return {
                    ...acc,
                    [val.question_id]: val.value
                }
            }, {});
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
        },
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

            const item = this.model.find(a => a.question_id === this.selectedQuestionId);
            const index = this.model.findIndex(a => a.question_id === this.selectedQuestionId);

            this.model = this.model.map((a, i) => {
                if (i === index) {
                    return {
                        ...item,
                        value
                    }
                }

                return a;
            })
            
            this.drawer = false;

            this.selectedQuestionId = null;

        }
    }
}
</script>