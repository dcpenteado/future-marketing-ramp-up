<template>
    <v-toolbar  elevation="0">
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        
        <v-spacer></v-spacer>

        <v-breadcrumbs
            v-if="breadcrumbsItems.length > 1"
            :items="breadcrumbsItems"
            divider=">"
        >
            <template v-slot:item="{ item }">
                <v-breadcrumbs-item :to="item.to">
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
            if (this.$route.meta.title) {
                return this.$route.meta.title
            }

            return this.$route.name
        },
        breadcrumbsItems(){
            const items = [
                { label: 'Painéis' },            
            ]

            this.$route.path.split('/')
                .filter(item => item)
                .map((_, index, array) => this.$router.resolve({ path: `/${array.slice(0, index + 1).join('/')}` }))
                .map((item) => item.route)
                .forEach((item) => {                    
                    items.push({
                        label: item.meta.title || item.name,
                        to: item.path
                    })
                })

            return items            
        }
    }
}
</script>