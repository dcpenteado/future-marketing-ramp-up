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
        
                    <v-col class="d-flex align-center justify-center" cols="12" sm="6">
                        <v-form @submit.prevent="login" >
                            
                            <v-card tile flat>
                                <v-card-title class="primary--text font-weight-bold font-ubuntu">  
                                    Bem-vindo de volta!
                                </v-card-title>
                                
                                <v-card-subtitle class="stardust--text font-weight-bold font-ubuntu"> 
                                    Faça seu login abaixo.
                                </v-card-subtitle>
        
                                <v-card-text>
                                    <v-row>
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
                                                type="password"
                                                label="Senha"
                                                outlined
                                                hide-details="auto"
                                            />
        
                                            <div class="mt-4 d-flex">
                                                <a href="#" class="stardust--text font-weight-bold font-ubuntu ml-auto text-decoration-none text-caption">
                                                    Esqueceu sua senha?
                                                </a>
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
            email: "",
            password: "",
            remember: true,
        };
    },
    methods: {
        async login() {
            const resp = await Api.login(this.email, this.password, this.remember);

            if (resp && resp.login_ok) {
                this.$router.push("/");
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
  