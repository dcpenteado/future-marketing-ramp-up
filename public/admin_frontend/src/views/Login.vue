<template>
    <div class="login_container">
        <v-img src="/login-background-pattern.png" class="login_background_pattern"></v-img>

        <v-container>

            <v-card
                width="100%"
                max-width="1180"
                class="overflow-hidden mx-auto"
            >      
            
                <v-row no-gutters>
                    <v-col
                        cols="6"
                        class="d-none d-sm-flex"
                    >
                        <v-img cover height="100%" max-height="580" src="/login-image.png"></v-img>
                    </v-col>
        
                    <v-col class="d-flex align-center justify-center px-xl-4" cols="12" sm="6">
                        <v-slide-x-reverse-transition leave-absolute>
                            <v-form v-if="mode === 'forgot_password'" class="w-full" @submit.prevent="resetPassword">
                                <v-card tile flat>
                                    <v-card-title class="primary--text font-weight-bold font-ubuntu">  
                                        Esqueceu sua senha?
                                    </v-card-title>
                                    
                                    <v-card-subtitle class="stardust--text font-weight-bold font-ubuntu"> 
                                        Redefina sua senha abaixo.
                                    </v-card-subtitle>
            
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="12">
                                                <div class="w-full d-flex justify-center">
                                                    <v-icon color="primary" style="font-size: 105px;" >mdi-email-fast-outline</v-icon>
                                                </div>
    
                                                <v-alert 
                                                    color="#E0A585"
                                                    text
                                                    class="font-ubuntu text-center mb-0 text-body-2"
                                                >
                                                    Instruções para redefinir sua senha serão enviadas para o seu email.
                                                </v-alert>
                                            </v-col>
    
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="email"
                                                    label="Email"
                                                    outlined
                                                    hide-details="auto"
                                                    autocomplete="email"
                                                />
                                            </v-col>
    
                                            <v-col cols="12">
                                                <v-btn
                                                    depressed
                                                    large
                                                    color="primary"
                                                    width="100%"
                                                    type="submit"
                                                >
                                                    Enviar
                                                </v-btn>
                                            </v-col>
    
                                            <v-col cols="12" class="d-flex justify-center">
                                                <div>
                                                    Espere, eu lembro minha senha! <a class="font-ubuntu text-none" @click="mode = 'login'">Voltar</a>
                                                </div>
                                            </v-col>
    
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-form>

                        </v-slide-x-reverse-transition>

                        <v-slide-x-transition leave-absolute>

                            <v-form v-if="mode !== 'forgot_password' " @submit.prevent="login" >                            
                                <v-card tile flat>
                                    <v-card-title class="primary--text font-weight-bold font-ubuntu">  
                                        Bem-vindo de volta!
                                    </v-card-title>
                                    
                                    <v-card-subtitle class="stardust--text font-weight-bold font-ubuntu"> 
                                        Faça seu login abaixo.
                                    </v-card-subtitle>
            
                                    <v-card-text>
                                        <v-row dense>
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="email"
                                                    label="Email"
                                                    outlined
                                                    hide-details="auto"
                                                />
                                            </v-col>
                                            
                                            <v-col cols="12">
                                                <v-text-field
                                                    v-model="password"
                                                    :type="showPassword ? 'text' : 'password'"
                                                    label="Senha"
                                                    outlined
                                                    hide-details="auto"
                                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append="showPassword = !showPassword"
                                                />
                                            </v-col>

                                            <v-col cols="12" sm="6">
                                                <v-checkbox
                                                    v-model="remember"
                                                    label="Lembrar-me"
                                                    hide-details
                                                    class="mt-0"
                                                />
                                            </v-col>
    
                                            <v-col cols="12" sm="6" class="d-flex align-center justify-sm-end">
                                                <div
                                                    small
                                                    text
                                                    class="font-ubuntu text-none gray--text text-caption"
                                                    @click="mode = 'forgot_password'"
                                                >
                                                    Esqueceu sua senha?
                                                </div>
                                            </v-col>

                                            <v-col cols="12">
                                                <v-btn
                                                    depressed
                                                    large
                                                    color="primary"
                                                    width="100%"
                                                    type="submit"
                                                >
                                                    Entrar
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-card-text>
                                </v-card>
                            </v-form>
                        </v-slide-x-transition>                        
                    </v-col>
                </v-row>
            </v-card>
        </v-container>
    </div>
</template>
  
<script>
import Api from "@/lib/Api";
import { emitToastr } from "@/lib/Utils";

export default {
    name: "LoginView",
    data() {
        return {
            // mode
            mode: "login",

            // Form
            email: "",
            password: "",
            remember: true,
            showPassword: false,
        };
    },
    methods: {
        async login() {
            const response = await Api.login(this.email, this.password, this.remember);

            if (response.error) {
                this.$toast('error', response.message);
                return
            }

            this.$router.push("/");
        },
        async resetPassword(){
            const resp = await Api.recoveryPassword(this.email);

            if (resp && resp.reset_ok) {
                emitToastr('success', 'Email enviado com sucesso!')
                return;
            }

            if (resp && resp.error && resp.error.message) {
                emitToastr('error', resp.error.message)
                return;
            }
        }
    },
};
</script>
  
<style scoped>
.login_container {
    background: linear-gradient(151.26deg, #615B95 0%, #29273D 58.5%);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.login_background_pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}


</style>
  