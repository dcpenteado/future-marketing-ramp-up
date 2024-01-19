<template>
  <v-app style="background-color: #eaeaea">
    <v-main v-if="$route.meta.layout === 'fullscreen'">
      <router-view></router-view>
    </v-main>

    <div v-if="$route.meta.layout === 'menu'">
      <v-progress-linear app indeterminate color="deep-purple lighten-3" class="loading-bar" v-show="showLoading"></v-progress-linear>

      <v-navigation-drawer class="drawer" :style="cssVars" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" width="270" app>
        <center class="avatar_container mt-10 mb-10">
          <div class="avatar">
            <img src="@/assets/logo-branco.png" width="175" />
          </div>
        </center>

        <v-list-item class="menu-label">PAINÉIS</v-list-item>

        <v-list dense>
          <router-link to="/meu-perfil">
            <v-list-item link>
              <v-list-item-action class="item_icon">
                <v-icon class="icon">mdi-monitor-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="menu-item">Meu perfil</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </router-link>


          <v-list>
            <v-list-group>
              <template v-slot:activator>
                <v-list-item-title class="menu-item">Meu site</v-list-item-title>
              </template>
              <template v-slot:prependIcon>
                <v-icon class="icon">mdi-cog-outline</v-icon>
              </template>

              <router-link :to="'/' + friendly_id + '/xxxxx'">
                <v-list-item>
                  <v-list-item-icon class="item_icon">
                    <v-icon class="icon">mdi-palette</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title class="menu-item">Minhas respostas</v-list-item-title>
                </v-list-item>
              </router-link>

              <router-link :to="'/' + friendly_id + '/xxxxx'">
                <v-list-item>
                  <v-list-item-icon class="item_icon">
                    <v-icon class="icon">mdi-palette</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title class="menu-item">Meus textos</v-list-item-title>
                </v-list-item>
              </router-link>

              <router-link :to="'/' + friendly_id + '/xxxxx'">
                <v-list-item>
                  <v-list-item-icon class="item_icon">
                    <v-icon class="icon">mdi-palette</v-icon>
                  </v-list-item-icon>

                  <v-list-item-title class="menu-item">Minhas aprovações</v-list-item-title>
                </v-list-item>
              </router-link>

            </v-list-group>
          </v-list>


        </v-list>

      </v-navigation-drawer>

      <v-main>
        <v-app-bar color="white" :clipped-left="$vuetify.breakpoint.lgAndUp" dark elevation="2">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="black"></v-app-bar-nav-icon>
          <v-toolbar-title class="toolbar">
            {{ projectName }}
          </v-toolbar-title>
          <v-spacer></v-spacer>

          <v-menu>
            <template #activator="{ on: menu }">
              <v-btn icon v-on="menu">
                <v-icon color="black">mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item style="cursor: pointer" @click="logout()">
                <v-list-item-title>Sair</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-app-bar>
        <v-container fluid class="menu-page-container">
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
  }),

  computed: {
    cssVars() {
      if (this.user?.admin) {
        return {
          '--drawer-background': '#252438'
        };

      }
      return {
          '--drawer-background': '#7069A1'
        };
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
a {
  text-decoration: none;
}

.menu-page-container {
  background-color: #eaeaea;
}

.toolbar {
  font-weight: 700;
  color: black;
}

.drawer {
  background: var(--drawer-background);
  z-index: 100;
}

.icon {
  color: white;
}

.item_icon {
  margin-right: 16px !important;
}

.logo {
  position: relative;
  margin-top: 30px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.menu-item {
  color: white;
  font-weight: 500 !important;
  font-size: 15px;
  text-overflow: none !important;
}

.menu-label {
  color: #B7B5CF !important;
  font-weight: 500 !important;
  font-size: 12px;
  text-transform: uppercase;
}

.loading-bar {
  position: absolute;
  z-index: 99999 !important;
}

.avatar_container {
  margin-bottom: 10px;
}

.rotate_icon {
  transform: rotate(90deg);
}

.toolbar-subtitle {
  font-size: 16px;
  font-weight: 500;
}
</style>
