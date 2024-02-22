<template>
    <div class="w-full">
        <v-autocomplete
            v-model="selected"
            :search-input.sync="search"
            prepend-inner-icon="mdi-magnify"
            placeholder="Pesquisar"
            single-line
            hide-details
            background-color="#F3F3F9"        
            solo
            flat
            dense
            persistent-placeholder
            style="max-width: 25rem;"
            append-icon=""
            return-object
            :items="results"
            :no-data-text="search ? 'Nenhum resultado encontrado' : 'Digite algo para pesquisar'"
            :loading="loading"
            @focus="load"
        >
        </v-autocomplete>
        
    </div>
</template>

<script>
export default {
    name: 'AppSearchBar',
    data: () => ({
        search: '',
        loading: false,
        selected: null,
    }),
    computed: {
        currentUser() {
            return this.$store.state.currentUser
        },
        isAdmin() {
            return this.currentUser?.admin;
        },
        menuItems(){
            const items = []

            this.$store.state.drawerMenuItems.forEach(item => {
                if (!item.children) {
                    return items.push({
                        text: item.label,
                        to: item.to
                    })
                }

                
                item.children.forEach(child => {
                    items.push({
                        text: `${item.label} > ${child.label}`,
                        to: child.to
                    })
                })
            })

            return items
        },
        formResponses(){
            const items = []

            this.$store.state.formResponse.items.forEach(item => {

                item.form.categories.forEach(c => {
                    items.push({
                        text: `${item.user.name} > ${item.form.name} > ${c.name}`,
                        to: `/form-responses/${item._id}/categories/${c.id}`
                    })
                })
            })

            return items
        },
        results(){
            if (!this.search) {
                return []
            }

            const all = this.menuItems.slice()

            if (this.formResponses.length) {
                all.push(...this.formResponses)
            }

            return all
        }

    },
    methods: {
        async setMenuItemsResults(){
            this.menuItems
                .filter(item => item.text.toLowerCase().includes(this.search.toLowerCase()))
                .map(item => this.results.push(item))
        },
        async load(){
            this.loading = true

            const promises = [
                this.setMenuItemsResults()
            ]

            if (this.isAdmin && !this.$store.state.formResponse.items.length) {
                promises.push(this.$store.dispatch('formResponse/load'))
            }

            await Promise.allSettled(promises)

            setTimeout(() => this.loading = false, 500)
        },
    },
    watch: {
        selected(item){
            if (item.to === this.$route.path) {
                this.search = ''
                return
            }

            if(item){
                this.search = ''
                this.$router.push(item.to)
            }
        }
    }
}
</script>