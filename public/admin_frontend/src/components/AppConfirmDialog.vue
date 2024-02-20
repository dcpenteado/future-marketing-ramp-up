<template>
    <v-dialog v-model="dialog.show" max-width="500">
        <v-card>
            <v-card-title>
                {{ dialog.title }}
            </v-card-title>
            <v-card-text>
                {{ dialog.message }}
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn @click="disagree" color="error">
                    Cancelar
                </v-btn>
                <v-btn color="primary" @click="agree">
                    Confirmar
                </v-btn>
            </v-card-actions>
        </v-card>

    </v-dialog>
</template>

<script>
/**
 * Global component to show a confirmation dialog
 */
export default {
    computed: {
        dialog: {
            get() {
                return this.$store.state.dialog
            },
            set(value) {
                this.$store.commit('setDialog', value)
            }
        }
    },
    methods: {
        agree() {
            this.dialog.show = false;

            if (this.dialog.resolve) {
                this.dialog.resolve(true);
            }
        },
        disagree() {
            this.dialog.show = false;

            if (this.dialog.resolve) {
                this.dialog.resolve(false);
            }
        }
    },
    watch: {
        dialog: {
            handler() {
                if (!this.dialog.show && this.dialog.resolve) {
                    this.dialog.resolve(false);
                }
            },
        }
    }
}
</script>