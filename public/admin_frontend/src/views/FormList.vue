<template>
    <v-card class="menu-page">
        <v-data-table
            :headers="headers"
            :items="forms"
        >

        </v-data-table>
    </v-card>
</template>

<script>
import Api from '@/lib/Api'

export default {
    name: 'FormList',
    data() {
        return {
            forms: [],
            headers: [
                {
                    text: 'Nome',
                    value: 'name'
                },
                {
                    text: 'Descrição',
                    value: 'description'
                },
                {
                    text: '',
                    value: 'actions'
                }
            ]
        }
    },
    created() {
        this.setForms();
    },
    methods: {
        async setForms() {
            const response = await Api.getForms();

            if (response.error) return

            this.forms = response.message;
        }
    }
}
</script>