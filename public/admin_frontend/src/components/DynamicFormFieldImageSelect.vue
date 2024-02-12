<template>
    <v-item-group v-model="model">
        <v-row>
            <v-col v-for="(item, index) in items" :key="index" v-bind="colAttrs">
                
                <v-item :value="item.value">
                    <template v-slot:default="{ active, toggle }">
                        <div class="d-flex w-full justify-start">
                            <div v-if="checkboxOutside" class="white">
                                <v-btn
                                    icon
                                    dark
                                    color="primary"
                                    class="mr-4"
                                    @click="toggle"                                    
                                >
                                    <v-icon>
                                        {{ active ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                                    </v-icon>
                                </v-btn>
                            </div>

                            <div class="flex-grow-1 overflow-hidden">
                                <v-img                                    
                                    :src="item.src"
                                    :alt="item.text"
                                    :height="height"
                                    :width="width"
                                    max-height="200"
                                    :style="{
                                        'opacity': active ? '1' : '0.5',
                                        'cursor': 'pointer'
                                    }"
                                    @click="toggle"
                                >
                                    <v-btn
                                        icon
                                        dark
                                        color="primary"
                                        style="position: absolute;top: 0;left: 0;"
                                        v-if="!checkboxOutside"
                                    >
                                        <v-icon>
                                            {{ active ? 'mdi-checkbox-marked' : 'mdi-checkbox-blank-outline' }}
                                        </v-icon>
                                    </v-btn>
                                </v-img>
                            </div>
    
                        </div>
                    </template>
                </v-item>

            </v-col>


        </v-row>


    </v-item-group>
</template>

<script>
export default {
    name: 'DynamicFormFieldImageSelect',
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
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        items(){
            return this.question.config?.items || [];
        },
        height(){
            return this.question.config?.height || 200;
        },
        width(){
            return this.question.config?.width || 200;
        },
        checkboxOutside(){
            return this.question.config?.checkboxOutside || false;
        },
        colAttrs(){
            if (this.question.config?.row){
                return {
                    cols: 12
                }
            }

            return {
                cols: 12,
                md: 3
            }
        }
    },
}
</script>