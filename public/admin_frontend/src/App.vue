<template>
  <v-app>
    <v-main v-if="$route.meta.layout === 'fullscreen'">
      <router-view></router-view>
    </v-main>

    <div v-if="$route.meta.layout === 'menu'">
      <v-progress-linear
        app
        indeterminate
        color="deep-purple lighten-3"
        class="loading-bar"
        v-show="showLoading"
      />

      <v-navigation-drawer
        class="drawer"
        v-model="drawer"
        :clipped="$vuetify.breakpoint.lgAndUp"
        width="270"
        app
        dark
        :color="isAdmin ? '#252438' : 'primary'"
      >

        <div class="px-4 my-10">
          <v-img src="/logo-white.png" cover width="134" class="mx-auto"   />
        </div>

        <v-list dense>
          <v-subheader class="font-ubuntu" >PAINÉIS</v-subheader>

          <template v-for="(item, i) in menuItems">
            <v-list-group
              v-if="item.children"
              :key="i"
              :prepend-icon="item.icon"
              active-class="white--text"
            >
              <template v-slot:activator>
                <v-list-item-title>{{ item.label }}</v-list-item-title>
              </template>
              
              <v-list-item
                v-for="(child, ci) in item.children"
                :key="ci"
                :to="child.to"
                class="moon--text"
              >
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

      <v-main>
        <v-app-bar
          color="white"
          :clipped-left="$vuetify.breakpoint.lgAndUp"
          elevation="0"
          class="app_bar"
        >
          <v-app-bar-nav-icon
            @click.stop="drawer = !drawer"
            color="mercury"
          />

          <v-text-field
            prepend-inner-icon="mdi-magnify"
            placeholder="Pesquisar"
            single-line
            hide-details
            background-color="#F3F3F9"        
            solo
            flat
            dense
            persistent-placeholder
            style="max-width: 230px;"
          />
          

          
          <v-spacer></v-spacer>

          <v-menu offset-y>
            <template #activator="{ on }">
              <v-btn icon v-on="on" color="mercury" >
                <v-icon >mdi-bell</v-icon>
              </v-btn>
            </template>

            <v-list dense>
              <v-list-item>
                <v-list-item-title>
                  Sem notificações
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y>            
            <template #activator="{ on }">
              <v-btn text v-on="on" height="48" >
                <div class="d-flex align-center">
                  <v-avatar size="32" class="mr-4 ">
                    <div class="w-full h-full primary d-flex justify-center">
                      <v-icon color="white" >mdi-account</v-icon>
                    </div>
                  </v-avatar>
  
                  <div class="mercury--text text-left text-none">
                    <div class="font-ubuntu font-weight-bold text-subtitle-2" >{{ user.name }}</div>
                    <div class="font-ubuntu text-body-2" >Cargo</div>
                  </div>

                </div>
              </v-btn>     
            </template>

            <v-list >
              <v-list-item @click="logout">
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>          
        </v-app-bar>

        <v-divider />

        <v-container fluid>
          <router-view fluid />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Api from "@/lib/Api";

export default {
  name: "App",

  data: () => ({
    drawer: false,
    showLoading: false,
    projectName: "Future Marketing",
    user: {},
    menuItems: [
      {
        label: "Meu perfil",
        icon: "mdi-account-circle-outline",
        to: "/meu-perfil",
      },
      {
        label: "Meu site",
        icon: "mdi-monitor-dashboard",
        children: [
          {
            label: "Minhas respostas",
            icon: "mdi-minus",
            to: "/#my-questions",
          },
          {
            label: "Meus textos",
            icon: "mdi-palette",
            to: "/#my-texts",
          },
          {
            label: "Minhas aprovações",
            icon: "mdi-palette",
            to: "/#my-approvals",
          },
        ],
      }
    ]
  }),

  computed: {
    isAdmin() {
      return this.user?.admin;
    },
  },

  methods: {
    logout() {
      Api.logout();
    },

    setLoading(loading) {
      this.showLoading = loading;
    },

    updateUser(user) {
      this.user = user;
    }
  },

  created() {
    this.$root.$refs.global = this;
  },

  async mounted() {
    this.user = Api.getUser();
    if (this.user && this.user._id) {
      this.user = await Api.getRemoteUser();
    }

    this.$vuetify.breakpoint.lgAndUp ? (this.drawer = true) : (this.drawer = false);
  },
};
</script>

<style scoped>
.loading-bar {
  position: absolute;
  z-index: 99999 !important;
}

</style>
