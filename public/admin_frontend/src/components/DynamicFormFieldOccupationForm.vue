<template>
    <v-row v-if="model.value">
        <v-col cols="12" v-if="errors.length > 0">
            <v-alert type="error" outlined>
                {{ errors[0] }}
            </v-alert>
        </v-col>

        <v-col cols="12">
            <v-select v-model="model.value.category" label="Categoria" v-bind="fieldAttrs" :items="categories" :error="errors.length > 0 && !model.value.category" />
        </v-col>

        <v-col cols="12">
            <v-text-field v-model="model.value.name" label="Nome da área de atuação" v-bind="fieldAttrs" :error="errors.length > 0 && !model.value.name" />
        </v-col>

        <v-col cols="12">
            <v-textarea v-model="model.value.introduction" label="Introdução (o que é)" v-bind="fieldAttrs" :error="errors.length > 0 && !model.value.introduction" />
        </v-col>

        <!-- TRATAMENTO REMOVIDO
        <v-col cols="12" v-if="model.value.category === 'Tratamento'">
            <v-textarea v-model="model.value.treatmentHowItWorks" :error="errors.length > 0 && !model.value.treatmentHowItWorks" label="Como funciona o tratamento" v-bind="fieldAttrs" />
        </v-col>
        -->

        <template v-if="model.value.category === 'Cirurgia'">
            <v-col cols="12">
                <v-textarea v-model="model.value.surgeryWhenIsRecommended" :error="errors.length > 0 && !model.value.surgeryWhenIsRecommended" label="Quando é indicada" v-bind="fieldAttrs" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="model.value.surgeryInterventionTypes" :error="errors.length > 0 && !model.value.surgeryInterventionTypes" label="Tipos de Intervenções (Explicar como é feita a cirurgia)" v-bind="fieldAttrs" />
            </v-col>
        </template>

        <template v-if="model.value.category === 'Procedimento'">
            <v-col cols="12">
                <v-textarea v-model="model.value.procedureRecommendations" :error="errors.length > 0 && !model.value.procedureRecommendations" label="Indicações" v-bind="fieldAttrs" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="model.value.procedureResults" :error="errors.length > 0 && !model.value.procedureResults" label="Resultados e benefícios" v-bind="fieldAttrs" />
            </v-col>
        </template>

        <template v-if="model.value.category === 'Enfermidade'">
            <v-col cols="12">
                <v-textarea v-model="model.value.diseaseSymptoms" :error="errors.length > 0 && !model.value.diseaseSymptoms" label="Sintomas e queixas comuns" v-bind="fieldAttrs" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="model.value.diseaseDiagnosis" :error="errors.length > 0 && !model.value.diseaseDiagnosis" label="Diagnóstico" v-bind="fieldAttrs" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="model.value.diseaseTreatments" :error="errors.length > 0 && !model.value.diseaseTreatments" label="Tratamentos" v-bind="fieldAttrs" />
            </v-col>
        </template>

        <template v-if="model.value.category === 'Área de atuação'">
            <v-col cols="12">
                <v-textarea v-model="model.value.areaWhenLookFor" :error="errors.length > 0 && !model.value.areaWhenLookFor" label="Quando buscar um profissional dessa area?" v-bind="fieldAttrs" />
            </v-col>
            <v-col cols="12">
                <v-textarea v-model="model.value.areaAdvantages" :error="errors.length > 0 && !model.value.areaAdvantages" label="Benefícios" v-bind="fieldAttrs" />
            </v-col>
        </template>

        <v-col cols="12">
            <v-textarea v-model="model.value.howTheAttendanceIsDone" :error="errors.length > 0 && !model.value.howTheAttendanceIsDone" label="Como o médico é realizado o atendimento" v-bind="fieldAttrs" />
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
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        categories: [
            /*{ text: "Tratamento", value: "Tratamento" },*/
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
        },
        fieldAttrs() {
            return {
                readonly: this.readonly,
                outlined: true,
                hideDetails: true,
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