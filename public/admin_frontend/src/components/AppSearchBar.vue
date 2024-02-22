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
        />            
        
        <v-menu offset-y v-model="menu"> 
            <v-card :loading="loading">
                <v-list dense>
                    <v-list-item
                        v-if="results.length === 0"
                    >
                        <v-list-item-title>
                            {{ search ? 'Nenhum resultado encontrado' : 'Digite algo para pesquisar' }}
                        </v-list-item-title>
                    </v-list-item>
                    
                    <v-list-item
                        v-for="(item, i) in results"
                        :key="i"
                        @click="select(item)"
                    >
                        <v-list-item-title>
                            {{ item.text }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card>
    
        </v-menu>
    </div>
</template>

<script>
export default {
    name: 'AppSearchBar',
    data: () => ({
        search: '',
        loading: false,
        results: [],
        selected: null,
        menu: false,
    }),
    computed: {
        menuItems(){
            return this.$store.state.drawerMenuItems
        },
        allMenuItems(){
            const items = []

            this.menuItems.forEach(item => {
                if(item.children){
                    return item.children.forEach(child => {
                        items.push({
                            text: `${item.label} > ${child.label}`,
                            to: child.to
                        })
                    })
                }

                items.push({
                    text: item.label,
                    to: item.to
                })
                
            })

            return items
        }
    },
    methods: {
        setStaticMenuResults(){
            this.allMenuItems
                .filter(item => item.text.toLowerCase().includes(this.search.toLowerCase()))
                .map(item => this.results.push(item))
        },
        setResults(){

            if (!this.search) {
                this.results = []
                return
            }

            this.loading = true
            
            this.results = this.allMenuItems.filter(item => item.text.toLowerCase().includes(this.search.toLowerCase()))

            setTimeout(() => this.loading = false, 500)
        },
    },
    watch: {
        search: 'setResults',
        selected(item){
            if(item){
                this.menu = false
                this.search = ''
                this.$router.push(item.to)
            }
        }
    }
}
</script>