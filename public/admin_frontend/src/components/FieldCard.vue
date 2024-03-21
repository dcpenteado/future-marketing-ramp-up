<template>
    <v-card
        v-show="show"
        :style="{
            'border-color': error ? 'red' : undefined,            
        }"
    >

    <template v-if="$slots.header">
        <div class="pa-4">
            <slot name="header"></slot>            
        </div>
    </template>

    <v-divider />
        
        <v-card-text
            :style="{
                'pointer-events': disabled ? 'none' : 'auto',
                'opacity': disabled ? '0.5' : '1'
            }"
        >
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
        disabled: {
            type: Boolean,
            default: false
        },
    }
}
</script>