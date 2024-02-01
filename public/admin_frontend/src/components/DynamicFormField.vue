<template>
    <v-row> 
        <v-col cols="12" v-for="(q) in questions" :key="q.id">
            <v-card outlined>
                <v-card-title>
                    {{ q.name }}
                </v-card-title>

                <v-card-subtitle>
                    {{ q.description }}
                </v-card-subtitle>

                <v-divider />
                
                <v-card-text>
                    
                </v-card-text>
            </v-card>        
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'DynamicForm',
    props: {
        questions: {
            type: Array,
            required: true
        },
        answers: {
            type: Array,
            required: true
        }
    }
}
</script>