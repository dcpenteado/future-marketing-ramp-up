<template>
    <div class="login_container">
        <v-img contain class="logo" src="@/assets/logo.png"></v-img>
        <v-card class="login_card" elevation="2">
            <v-card-title>Entrar</v-card-title>
            <v-card-subtitle>Entre com suas informações de login</v-card-subtitle>

            <v-card-text>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="email" label="Email" outlined hide-details="auto"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="password" type="password" label="Senha" outlined hide-details="auto"></v-text-field>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn depressed large color="primary" @click.native="login">
                    Entrar
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>
  
<script>
import Api from "@/lib/Api";
import { emitToastr } from "@/lib/Utils";
//import { emitToastr } from "@/lib/Utils";

export default {
    name: "LoginView",

    data() {
        return {
            email: "",
            password: "",
            remember: true,
        };
    },

    components: {},

    mounted() {
        
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
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    align-content: center;
    align-items: center;
}

.logo {
    max-width: 300px;
    max-height: 300px;
}

@media only screen and (max-width: 768px) {
    .login_container {
        text-align: center;
        padding: 8%;
    }

}
</style>
  