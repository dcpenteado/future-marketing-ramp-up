<template>
    <div>
        <v-card outlined>
            <v-card-text>
                <v-form @submit.prevent="save">
                    <v-row>
                        <v-col cols="12">
                            <v-row>
                                <v-col cols="12" sm="4" md="3" lg="2" class="d-flex justify-center">
                                    <v-avatar size="160">
                                        <v-img :src="image.preview" v-if="image.preview" />
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
                                v-model="form.name"
                                label="Nome"
                                required
                                outlined
                                hide-details="auto"
                            />    
                        </v-col>
                        
                        <v-col cols="12" md="6"> 
                            <v-text-field
                                v-model="form.email"
                                label="E-mail"
                                required
                                outlined
                                hide-details="auto"
                            />    
                        </v-col>
                        
                        <v-col cols="12" class="d-flex">
                            <v-spacer />
                            <v-btn color="error" class="mr-2" @click="load">Cancel</v-btn>
                            <v-btn color="primary" type="submit">Salvar</v-btn>
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
            form: {
                name: '',
                email: '',
            },
            image: {
                file: null,
                preview: null,
            }
        };
    },
    mounted(){
        this.load()
    },
    methods: {
        load(){
            const user = Api.getUser()

            this.form.name = user.name
            this.form.email = user.email
        },
        pickFile(){
            const input = document.createElement('input')

            input.type = 'file'
            input.accept = 'image/jpeg, image/png'

            input.onchange = (e) => {
                const file = e.target.files[0]

                this.setImage(file)
            }
            
            input.click()
        },
        removeImage(){
            this.image.file = null
            this.image.preview = null
        },
        setImage(file){
            const preview = URL.createObjectURL(file)

            this.image.file = file
            this.image.preview = preview
        },
        save(){
            emitToastr('error', 'Não implementado')
        }
    },
};
</script>
  
<style scoped></style>
  