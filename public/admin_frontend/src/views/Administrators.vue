<template>
    <v-card outlined>
        <v-data-table
            :headers="headers"
            :items="administrators"
        >

        </v-data-table>
    </v-card>
</template>

<script>
import Api from '@/lib/Api'

export default {
    name: 'Administrators',
    data() {
        return {
            administrators: [],
            headers: [
                {
                    text: 'Nome',
                    value: 'name'
                },
                {
                    text: 'E-mail',
                    value: 'email'
                },
                {
                    text: '',
                    value: 'actions'
                }
            ]
        }
    },
    created() {
        this.getAdministrators();
    },
    methods: {
        async getAdministrators() {
            const response = await Api.getAdministrators();

            if (response.error) return

            this.administrators = response.message;
        }
    }
}
</script>