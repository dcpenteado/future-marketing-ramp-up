<template>
    <v-row v-if="model.value">
        <v-col cols="12" v-if="errors.length">
            <v-alert type="error" outlined>
                {{ errors[0] }}
            </v-alert>
        </v-col>

        <v-col cols="12">
            <v-select
                v-model="model.value.category"
                label="Categoria"
                outlined
                hide-details
                :items="categories"
            />
        </v-col>

        <v-col cols="12">
            <v-text-field
                v-model="model.value.name"
                label="Nome da area de atuação"
                outlined
                hide-details
            />
        </v-col>

        <v-col cols="12">
            <v-textarea
                v-model="model.value.introduction"
                label="Introdução (o que é)"
                outlined
                hide-details
            />
        </v-col>

        <v-col cols="12" v-if="model.value.category === 'Tratamento'">            
            <v-textarea
                v-model="model.value.treatmentHowItWorks"
                label="Como funciona o tratamento"
                outlined
                hide-details
            />
        </v-col>        

        <template v-if="model.value.category === 'Cirurgia'">
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.surgeryWhenIsRecommended"
                    label="Quando é indicada"
                    outlined
                    hide-details 
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.surgeryInterventionTypes"
                    label="Tipos de Intervenções (Explicar como é feita a cirurgia)"
                    outlined
                    hide-details
                />
            </v-col>
        </template>

        <template v-if="model.value.category === 'Procedimento'">
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.procedureRecommendations"
                    label="Indicações"
                    outlined
                    hide-details
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.procedureResults"
                    label="Resultados e benefícios"
                    outlined
                    hide-details
                />
            </v-col>
        </template>

        <template v-if="model.value.category === 'Enfermidade'">
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.diseaseSymptoms"
                    label="Sintomas e queixas comuns"
                    outlined
                    hide-details
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.diseaseDiagnosis"
                    label="Diagnóstico"
                    outlined
                    hide-details
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.diseaseTreatments"
                    label="Tratamentos"
                    outlined
                    hide-details
                />
            </v-col>
        </template>

        <template  v-if="model.value.category === 'Área de atuação'">
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.areaWhenLookFor"
                    label="Quando buscar um profissional dessa area?"
                    outlined
                    hide-details
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="model.value.areaAdvantages"
                    label="Benefícios"
                    outlined
                    hide-details
                />
            </v-col>
        </template>

        <v-col cols="12">
            <v-textarea
                v-model="model.value.howTheAttendanceIsDone"
                label="Como o médico é realizado o atendimento"
                outlined
                hide-details
            />
        </v-col>

        <v-col cols="12">
            <v-textarea
                v-model="model.value.aboutTheProfessional"
                label="Sobre o médico"
                outlined
                hide-details
            />
        </v-col>       
    </v-row>
</template>

<script>
export default {
    name: 'DynamicFormFieldOccupationForm',
    props: {
        value: {
            type: Object,
            default: () => ({
                value: null
            })
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        }
    },
    data: () => ({
        categories: [
            { text: "Tratamento", value: "Tratamento" },
            { text: "Cirurgia", value: "Cirurgia" },
            { text: "Procedimento", value: "Procedimento" },
            { text: "Enfermidade", value: "Enfermidade" },
            { text: "Área de atuação (Ex: Nutrologia)", value: "Área de atuação" },
        ],
    }),
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        }
    },
    mounted() {
        if (!this.model.value) {
            this.model.value = {
                category: null,
                name: null,
                introduction: null,
            }
        }
    }
}
</script>