<template>
    <div class="w-full">
        
        <v-menu offset-y v-model="menu"> 
        
        <template v-slot:activator="{ on }">
            <v-text-field
                v-model="search"
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
                v-on="on" 
            />            
        </template>

            <v-card :loading="loading">
                <v-list dense>
                    <v-list-item
                        v-if="results.length === 0"
                    >
                        <v-list-item-title>
                            Nenhum resultado encontrado
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
                    item.children.forEach(child => {
                        items.push({
                            text: `${item.label} > ${child.label}`,
                            to: child.to
                        })
                    })
                    
                    return
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
        setResults(){

            if (!this.search) {
                this.results = []
                return
            }

            this.loading = true
            
            this.results = this.allMenuItems.filter(item => item.text.toLowerCase().includes(this.search.toLowerCase()))

            setTimeout(() => {
                this.loading = false
            }, 500)
        },
        select(item){
            this.menu = false
            this.search = ''
            this.$router.push(item.to)
        }
    },
    watch: {
        search: 'setResults'
    }
}
</script>