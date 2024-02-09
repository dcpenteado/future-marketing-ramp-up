<template>
    <div>
        <v-radio-group v-model="source">    
            <v-radio value="google_business" label="Importar depoimentos do google meu negócio" />
    
            <v-radio value="manual" label="Adicionar depoimentos manualmente" />            
        </v-radio-group>

        <div v-if="source === 'google_business'">
            <v-alert outlined type="info">
                Importar depoimentos do google meu negócio
            </v-alert>

            <v-text-field v-model="googleBusinessId" label="ID do google meu negócio" outlined />
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: {
            type: [String, Array],
            default: null
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        source: 'google_business',
        googleBusinessId: null
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
    },
}
</script>