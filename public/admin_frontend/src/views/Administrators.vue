<template>
    <div class="menu-page">
        <v-card class="mb-4">
            <v-card-text>
                <v-btn color="primary" @click.native="newObject">Novo administrador</v-btn>
            </v-card-text>
        </v-card>

        <v-card>
            <v-data-table :headers="headers" :items="administrators">

                <template v-slot:[`item.created`]="{ item }">
                    {{ new Date(item.created).toLocaleString('pt-BR') }}
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="actions-container">
                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon medium class="mr-4" color="primary" @click.stop="object = item; dialogCreateUpdateObject = true" v-bind="attrs" v-on="on"> mdi-file-edit-outline</v-icon>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>

                        <v-tooltip left>
                            <template v-slot:activator="{ on, attrs }">
                                <v-icon medium class="mr-4" color="error" @click.stop="object = item; dialogDeleteObject = true" v-bind="attrs" v-on="on"> mdi-trash-can-outline</v-icon>
                            </template>
                            <span>Apagar</span>
                        </v-tooltip>
                    </div>
                </template>
            </v-data-table>
        </v-card>

        <dialog-or-bottom-sheet v-model="dialogCreateUpdateObject" max-width="500">
            <v-card>
                <v-card-title>
                    {{ object._id ? 'Editar' : 'Novo' }}
                </v-card-title>
                <v-card-text>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field autocomplete="nope" dense v-model="object.name" label="Nome" outlined hide-details="auto"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field autocomplete="nope" dense v-model="object.email" label="E-mail" outlined hide-details="auto"></v-text-field>
                        </v-col>
            
                        <v-col cols="12">
                            <v-text-field autocomplete="nope" dense v-model="object.password" label="Senha" outlined hide-details="auto"></v-text-field>
                        </v-col>
            
                        <v-col cols="12">
                            <v-btn color="primary" block @click.native="createOrUpdateObject" :loading="loadingButton">Salvar usuário</v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </dialog-or-bottom-sheet>

        <v-dialog v-model="dialogDeleteObject" max-width="350">
            <v-card>
                <v-card-title class="text-h5">
                    Apagar pergunta
                </v-card-title>
                <v-card-text>Tem certeza que deseja apagar o administrador <b>{{ object.email }}</b>? Essa operação é irreversível.</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="dialogDeleteObject = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="error" text @click="dialogDeleteObject = false; object.filed = true; createOrUpdateObject()">
                        Apagar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import Api from '@/lib/Api';
import { emitToastr } from '@/lib/Utils';

export default {
    name: 'Administrators',
    data() {
        return {
            administrators: [],
            object: {},
            loadingButton: false,
            dialogCreateUpdateObject: false,
            dialogDeleteObject: false,
            headers: [
                { text: 'Nome', value: 'name' },
                { text: 'E-mail', value: 'email' },
                { text: 'Criação', value: 'created' },
                { text: '', value: 'actions' }
            ]
        }
    },
    created() {
        this.getAdministrators();
    },
    methods: {
        async getAdministrators() {
            const response = await Api.getAdministrators();

            if (response.error) return;

            this.administrators = response.message;
        },

        async createOrUpdateObject() {
            this.loadingButton = true;
            this.object.admin = true;
            let response;

            if (this.object._id) {
                response = await Api.updateUser(this.object);
            }
            else {
                response = await Api.createUser(this.object);
            }

            this.loadingButton = false;

            if (response.error) {
                return emitToastr('error', response.message || "Erro. Tente novamente mais tarde.");
            }
            else {
                emitToastr('success', "Operação bem sucedida.");
            }

            await this.getAdministrators();
            this.dialogCreateUpdateObject = false;
            this.dialogDeleteObject = false;
        },

        newObject() {
            this.object = { admin: true };
            this.dialogCreateUpdateObject = true;
        }
    }
}
</script>

<style>
.bottom-modal-container {
    padding: 5%;
}
</style>