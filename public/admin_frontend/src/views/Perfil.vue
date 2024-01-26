<template>
    <div>
        <v-card outlined>
            <v-card-text>
                <v-form>
                    <v-row>
                        <v-col cols="12" md="2" class="d-flex justify-center">
                            <v-avatar size="160">
                                <div class="w-full h-full primary d-flex justify-center">
                                    <v-icon color="white" style="font-size:120px" >mdi-account</v-icon>
                                </div>
                            </v-avatar>
                        </v-col>

                        <v-col cols="12" md="10">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="form.name"
                                        label="Nome"
                                        required
                                        outlined
                                        hide-details="auto"
                                    />    
                                </v-col>
                                
                                <v-col cols="12">
                                    <v-text-field
                                        v-model="form.email"
                                        label="E-mail"
                                        required
                                        outlined
                                        hide-details="auto"
                                    />    
                                </v-col>
                            </v-row>
                        </v-col>

                        
                        <v-col cols="12" class="d-flex">
                            <v-spacer />
                            <v-btn color="error" class="mr-2">Cancel</v-btn>
                            <v-btn color="primary">Salvar</v-btn>
                        </v-col>
                    </v-row> 
                </v-form>
            </v-card-text>
        </v-card>
        
    </div>
</template>
  
<script>
import Api from "@/lib/Api";
//import { emitToastr } from "@/lib/Utils";

export default {
    name: "PerfilView",

    data() {
        return {
            form: {
                name: '',
                email: '',
            }
        };
    },
    mounted(){
        const user = Api.getUser()

        this.form.name = user.name
        this.form.email = user.email
    },
    methods: {
    },
};
</script>
  
<style scoped></style>
  