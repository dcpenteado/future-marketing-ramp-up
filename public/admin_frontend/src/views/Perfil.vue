<template>
    <div>
        <v-card outlined class="mb-4">
            <v-card-text>
                <v-form @submit.prevent="save">
                    <v-row>
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="12" sm="4" md="3" lg="2" class="d-flex justify-center">
                                    <v-avatar size="160">
                                        <v-img :src="userImage" v-if="userImage" />
                                        <div v-else class="w-full h-full primary d-flex justify-center">
                                            <v-icon color="white" style="font-size:120px" >mdi-account</v-icon>
                                        </div>
                                    </v-avatar>
                                </v-col>

                                <v-col cols="12" sm="auto" class="d-flex align-center text-center text-sm-left">
                                    <div>
                                        <v-btn color="primary" class="mb-2 mb-sm-0 mr-sm-2" @click="pickFile">Alterar Foto</v-btn>
                                        <v-btn color="error" @click="removeImage" >Remover Foto</v-btn>
    
                                        <div class="w-full mt-4">
                                            Imagens permitidas: JPG, PNG e com tamanho máximo de 2MB.
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="user.name"
                                label="Nome"
                                required
                                outlined
                                hide-details="auto"
                            />    
                        </v-col>
                        
                        <v-col cols="12" md="6"> 
                            <v-text-field
                                v-model="user.email"
                                label="E-mail"
                                required
                                outlined
                                hide-details="auto"
                            />    
                        </v-col>
                        
                        <v-col cols="12" class="d-flex">
                            <v-spacer />
                            <v-btn color="error" class="mr-2" @click="load" :disabled="saving">Cancelar</v-btn>
                            <v-btn color="primary" type="submit" :loading="saving">Salvar</v-btn>
                        </v-col>
                    </v-row> 
                </v-form>
            </v-card-text>
        </v-card>

        <v-card outlined>
            <v-card-title>
                Redefinir senha
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="updatePassword">
                    <v-row>
                        <v-col cols="12">
                            <v-text-field
                                v-model="updatePasswordForm.oldPassword"
                                label="Senha atual"
                                outlined
                                hide-details="auto"
                                :type="updatePasswordForm.showPassword ? 'text' : 'password'"
                                :append-icon="updatePasswordForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="updatePasswordForm.showPassword = !updatePasswordForm.showPassword"
                            />    
                        </v-col>
                        
                        <v-col cols="12"> 
                            <v-text-field
                                v-model="updatePasswordForm.newPassword"
                                label="Nova senha"
                                outlined
                                hide-details="auto"
                                :type="updatePasswordForm.showPassword ? 'text' : 'password'"
                                :append-icon="updatePasswordForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="updatePasswordForm.showPassword = !updatePasswordForm.showPassword"
                            />    
                        </v-col>
                        
                        <v-col cols="12"> 
                            <v-text-field
                                v-model="updatePasswordForm.confirmNewPassword"
                                label="Confirmar nova senha"
                                outlined
                                hide-details="auto"
                                :type="updatePasswordForm.showPassword ? 'text' : 'password'"
                                :append-icon="updatePasswordForm.showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="updatePasswordForm.showPassword = !updatePasswordForm.showPassword"
                            />    
                        </v-col>
                        
                        <v-col cols="12" class="d-flex justify-end">
                            <v-btn color="primary" type="submit">Redefinir senha</v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
        
    </div>
</template>
  
<script>
import Api from "@/lib/Api";
import { emitToastr } from "@/lib/Utils";

export default {
    name: "PerfilView",

    data() {
        return {
            user: {
                name: '',
                email: '',
                profile_picture: ''
            },
            saving: false,
            image: {
                file: null,
                preview: null,
            },
            updatePasswordForm: {
                showPassword: false,
                oldPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            }
        };
    },
    computed: {
        userImage(){
            return this.image.preview || this.user.profile_picture;
        }
    },
    mounted(){
        this.load()
    },
    methods: {
        async load(){
            const user = await Api.getRemoteUser();

            this.user = user;
            
            this.image.preview = null;
            this.image.file = null;
        },
        
        async pickFile(){
            const input = document.createElement('input')

            input.type = 'file'
            input.accept = 'image/jpeg, image/png'

            input.onchange = async (e) => {
                const file = e.target.files[0]

                this.setImage(file)
            }
            
            input.click()
        },
        removeImage(){
            this.image.file = null
            this.user.profile_picture = null
        },
        setImage(file){
            const preview = URL.createObjectURL(file)

            this.image.file = file
            this.image.preview = preview
        },
        async saveUserImage(file){
            const response = await Api.uploadProfilePicture(file);

            if (response.error) {
                emitToastr('error', response.message);
                return
            }

            this.user.profile_picture = response.message;
        },
        async save(){
            this.saving = true;

            if (this.image.file) {
                await this.saveUserImage(this.image.file);
            }

            const response = await Api.updateUser(this.user);

            if (response.error) {
                emitToastr('error', response.message);
                return;
            }

            setTimeout(() => {
                this.saving = false;
                
                emitToastr('success', 'Dados atualizados com sucesso');

            }, 800);

        },
        async updatePassword(){
            const { oldPassword, newPassword, confirmNewPassword } = this.updatePasswordForm;

            if (!oldPassword || !newPassword || !confirmNewPassword) {
                emitToastr('error', 'Preencha todos os campos');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                emitToastr('error', 'As senhas não conferem');
                return;
            }

            const response = await Api.changeUserPassword(newPassword, oldPassword);

            if (response.error) {
                emitToastr('error', response.message);
                return;
            }

            emitToastr('success', 'Senha alterada com sucesso');
        }
    },
};
</script>
  