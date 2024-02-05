<template>
    <v-card outlined>
        <v-data-table
            :headers="headers"
            :items="customers"
        >

        </v-data-table>
    </v-card>
</template>

<script>
import Api from '@/lib/Api'

export default {
    name: 'Customers',
    data() {
        return {
            customers: [],
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
        this.getCustomers();
    },
    methods: {
        async getCustomers() {
            const response = await Api.getCustomers();

            if (response.error) return

            this.customers = response.message;
        }
    }
}
</script>