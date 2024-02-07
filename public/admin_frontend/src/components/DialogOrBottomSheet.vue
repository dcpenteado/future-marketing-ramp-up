<template>
    <v-bottom-sheet v-bind="$attrs" v-on="$listeners" v-if="isMobile">
        <slot />
    </v-bottom-sheet>
    
    <v-dialog v-else v-bind="$attrs" v-on="$listeners">
        <slot />
    </v-dialog>

</template>

<script>

/**
 * Component that shows a dialog on desktop and a bottom sheet on mobile
 */

 export default {
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.smAndDown;
        }
    }
 }

</script>

