<template>
    <v-toolbar  elevation="0">
        <div>

            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <div style="font-size:.8rem" class="grey--text" v-if="subtitle">{{ subtitle }}</div>
        </div>
        
        <v-spacer></v-spacer>

        <v-breadcrumbs
            v-if="breadcrumbs.length > 1"
            :items="breadcrumbs"
            divider=">"
        >
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item
                    :to="item.to"
                    :disabled="item.disabled"
                    exact
                >
                    {{ item.label }}
                </v-breadcrumbs-item>
            </template>
        </v-breadcrumbs>
        
    </v-toolbar>
</template>

<script>
export default {
    name: 'AppSubheader',
    computed: {
        title() {
            if (this.$store.state.pageTitle) {
                return this.$store.state.pageTitle
            }

            if (this.$route.meta.title) {
                return this.$route.meta.title
            }

            return this.$route.name
        },
        subtitle() {
            return this.$store.state.pageSubtitle
        },
        breadcrumbs(){
            const items = [
                { label: 'Painéis' }
            ]

            return items.concat( this.$store.state.breadcrumbs)
        }
    }
}
</script>