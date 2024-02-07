<template>
  <v-app>
    <v-main v-if="$route.meta.layout === 'fullscreen'">
      <router-view></router-view>
    </v-main>

    <div v-if="$route.meta.layout === 'menu'">

      <app-drawer v-model="drawer" />

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
                    <v-img v-if="currentUser?.profile_picture" :src="currentUser?.profile_picture" />
                    <div v-else class="w-full h-full primary d-flex justify-center">
                      <v-icon color="white" >mdi-account</v-icon>
                    </div>
                  </v-avatar>
  
                  <div class="mercury--text text-left text-none">
                    <div class="font-ubuntu font-weight-bold text-subtitle-2" >{{ currentUser?.name }}</div>
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

        <template v-if="pageLoading">
          <v-progress-linear
            indeterminate
            color="deep-purple lighten-3"
            class="loading-bar"
          />
        </template>        

        <app-subheader v-show="!pageLoading" />

        <v-divider v-show="!pageLoading" />

        <v-container fluid v-show="!pageLoading">
          <router-view v-if="currentUser" />
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import Api from "@/lib/Api";

export default {
  name: "App",
  components: {
    AppSubheader: () => import("@/components/AppSubheader.vue"),
    AppDrawer: () => import("@/components/AppDrawer.vue"),
  },

  data: () => ({
    drawer: false,
    projectName: "Future Marketing",
  }),

  computed: {
    pageLoading() {
      return this.$store.state.pageLoading
    },
    currentUser() {
      return this.$store.state.currentUser
    },
  },
  methods: {
    logout() {
      Api.logout();
    },
  },
  watch: {
    '$route': {
      immediate: true,
      handler: async function () {
        this.$store.commit('setBreadcrumbs', [])
        this.$store.commit('setPageTitle', null)
        
        if (this.currentUser) return

        if (this.$route.meta.layout === 'fullscreen') return

        if (this.$route.path === '/login') return

        this.$store.dispatch('loadCurrentUser')
      },
    }
  },

  created() {
    this.$root.$refs.global = this;
  },

  mounted() {
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
