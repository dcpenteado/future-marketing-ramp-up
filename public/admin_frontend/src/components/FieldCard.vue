<template>
    <v-card>
        
            <div class="pa-4">
                <slot name="header">
                    <v-row align="start">
                        <v-col cols="9">
                            <v-card-title
                                class="break-words pa-0 ma-0"
                                :class="error ? 'error--text' : ''"
                            >
                                {{ title }}
                            </v-card-title>
                    
                            <v-card-subtitle
                                class="break-words pa-0 ma-0"
                                :class="error ? 'error--text' : ''"
                            >
                                {{ description }}
                            </v-card-subtitle>
                        </v-col>
        
                        <v-col cols="3">
                                <slot name="header-actions" />                
                        </v-col>
                </v-row>
                </slot>            
            </div>

    <v-divider />
        
        <v-card-text :style="{ 'opacity': readonly ? '0.6' : '1' }">
            <slot />            
        </v-card-text>

        <template v-if="$slots.footer">

            <v-divider />

            <div class="pa-4">
    
                <slot name="footer" />
    
            </div>
        </template>

    </v-card>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        },
        error: {
            type: Boolean,
            default: false
        },
        readonly: {
            type: Boolean,
            default: false
        },
    }
}
</script>