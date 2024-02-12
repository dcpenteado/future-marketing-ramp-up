<template>
    <div>
        <v-row>
            <v-col
                cols="12"
                :sm="disabled ? 12 : 4"
                :md="disabled ? 12 : 3"
            >
                <v-card height="260" :loading="uploading">
                    <v-img v-if="model" :src="model" height="260" />
                    <div v-else class="w-full h-full primary d-flex justify-center">
                        <v-icon color="white" style="font-size:100px" >mdi-image</v-icon>
                    </div>
                </v-card>
            </v-col>

            <v-col v-if="!disabled" cols="12" sm="auto" class="d-flex align-center text-center text-sm-left">
                <div>
                    <v-btn
                        color="primary"
                        class="mb-2 mb-sm-0 mr-sm-2"
                        :loading="uploading"
                        @click="pickFile"
                    >
                        Alterar imagem
                    </v-btn>
                    <v-btn
                        color="error"
                        :disabled="uploading"
                        @click="removeImage"
                    >
                        Remover imagem
                    </v-btn>

                    <div class="w-full mt-4">
                        Imagens permitidas: JPG, PNG e com tamanho máximo de 2MB.
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'DynamicFormFieldImagePicker',
    props: {
        value: {
            type: [String, Number, Boolean],
            default: null
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        uploading: false
    }),
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
    },
    methods: {
        async pickFile(){
            const input = document.createElement('input')

            input.type = 'file'
            input.accept = 'image/jpeg, image/png'

            input.onchange = (e) => {
                const file = e.target.files[0]

                this.upload(file)
            }
            
            input.click()
        },
        async upload(file){
            this.uploading = true;

            const response = await this.$api.uploadImage(file);

            if (response.error) {
                this.uploading = false;
                this.$toast('error', response.message);
                return
            }

            this.model = response.message;

            setTimeout(() => {
                this.uploading = false;
            }, 800);
        },
        removeImage(){
            this.model = null;
        }
    }
}
</script>