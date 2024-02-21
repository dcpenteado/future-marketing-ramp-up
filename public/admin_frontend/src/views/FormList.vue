<template>
    <v-card class="menu-page">
        <v-data-table
            :headers="headers"
            :items="forms"
        >

            <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip left>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn
                            :to="`/forms/${item._id}/elements`"
                            v-bind="attrs"
                            v-on="on"
                            icon
                            text
                        >

                            <v-icon medium>
                                mdi-console
                            </v-icon>
                        </v-btn>                        
                    </template>
                    <span>Elementos</span>
                </v-tooltip>
            </template>

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
                },
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