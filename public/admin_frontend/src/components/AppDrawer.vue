<template>
    <v-navigation-drawer class="drawer" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" width="270" app dark
        :color="isAdmin ? '#252438' : 'primary'">

        <router-link to="/" class="d-block px-4 my-10">
            <v-img src="/logo-white.svg" cover width="134" class="mx-auto" />
        </router-link>

        <v-list dense expand>
            <v-subheader class="font-ubuntu">PAINÉIS</v-subheader>

            <template v-for="(item, i) in menuItems">
                <v-list-group v-if="item.children" :key="i" :prepend-icon="item.icon" active-class="white--text"
                    :value="true">
                    <template v-slot:activator>
                        <v-list-item-title>{{ item.label }}</v-list-item-title>
                    </template>

                    <v-list-item v-for="(child, ci) in item.children" :key="ci" :to="child.to" class="moon--text">
                        <v-list-item-icon>
                            <span class="mx-auto">
                                -
                            </span>
                        </v-list-item-icon>

                        <v-list-item-title>
                            {{ child.label }}
                        </v-list-item-title>
                    </v-list-item>
                </v-list-group>

                <v-list-item v-else :key="i" :to="item.to">
                    <v-list-item-icon>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                        <v-list-item-title>
                            {{ item.label }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </template>
        </v-list>

    </v-navigation-drawer>
</template>

<script>
export default {
    name: 'AppDrawer',
    props: {
        value: {
            type: Boolean,
            default: false
        },
    },
    computed: {
        drawer: {
            get() {
                return this.value;
            },
            set(value) {
                this.$emit('input', value);
            }
        },
        currentUser() {
            return this.$store.state.currentUser
        },
        isAdmin() {
            return this.currentUser?.admin;
        },
        menuItems: {
            get() {
                return this.$store.state.drawerMenuItems;
            },
            set(value) {
                this.$store.commit('setDrawerMenuItems', value);
            }
        }
    },
    methods: {
        async addCustomerMenuItems() {
            const site = {
                label: "Meu site",
                icon: "mdi-monitor-dashboard",
                children: [
                    {
                        label: "Meus textos",
                        to: "/#my-texts",
                    },
                    {
                        label: "Minhas aprovações",
                        to: "/#my-approvals",
                    },
                ],
            }

            const response = await this.$api.getFormResponseByUserId(this.currentUser._id)

            if (!response.error) {
                site.children.unshift({
                    label: "Formulário",
                    to: {
                        name: 'FormResponseSingle',
                        params: {
                            formResponseId: response.message._id
                        }
                    },
                })
            }

            this.menuItems.push(site)
        },
        async addAdminMenuItems() {
            this.menuItems.push(
                {
                    label: "Minha plataforma",
                    icon: "mdi-monitor-dashboard",
                    children: [
                        {
                            label: "Clientes",
                            to: "/customers",
                        },
                        {
                            label: "Administradores",
                            to: "/administrators",
                        },
                        {
                            label: "Elementos Ramp-Up",
                            to: "/forms",
                        },
                        {
                            label: "Criação de sites",
                            to: "/form-responses",
                        }
                    ]
                },
            )
        },
        async setMenuItems() {

            if (!this.currentUser) {
                return;
            }

            this.menuItems = [
                {
                    label: "Meu perfil",
                    icon: "mdi-account-circle-outline",
                    to: '/meu-perfil'
                }
            ]

            if (this.isAdmin) {
                return this.addAdminMenuItems();
            }

            return this.addCustomerMenuItems();
        }
    },
    watch: {
        currentUser: {
            immediate: true,
            handler: 'setMenuItems'
        }
    },

}
</script>