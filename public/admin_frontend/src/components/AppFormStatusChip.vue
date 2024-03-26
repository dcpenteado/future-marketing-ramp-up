<template>
    <v-chip
        :color="color"
        text-color="white"
        class="text-capitalize"
        v-bind="$attrs"
    >
        {{ label }}
    </v-chip>
</template>

<script>
export default {
    props: {
        status: {
            type: Number,
            required: true
        }
    },
    computed: {
        label() {
            return this.$store.state.form_response_statuses[this.status]
        },
        color(){
            if (this.status <= this.$store.state.formResponseEnum.FILLING_DONE) {
                return 'blue'
            }
            
            if (this.status <= this.$store.state.formResponseEnum.AI_PROCESSED) {
                return 'purple'
            }
            
            if (this.status <= this.$store.state.formResponseEnum.FINAL_REVIEW) {
                return 'warning'
            }
            
            if (this.status <= this.$store.state.formResponseEnum.FINISHED) {
                return 'success'
            }

            return 'grey'
        }
    }
}

</script>