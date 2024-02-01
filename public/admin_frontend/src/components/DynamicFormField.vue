<template>
    <v-card outlined>
        <v-card-title>
            {{ question.name }}
        </v-card-title>

        <v-card-subtitle>
            {{ question.description }}
        </v-card-subtitle>

        <v-divider />
        
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    name: 'DynamicFormField',
    props: {
        question: {
            type: Object,
            required: true,
            default: () => ({
                name: 'Nome da pergunta',
                description: 'Descrição da pergunta'
            })
        },
    }
}
</script>