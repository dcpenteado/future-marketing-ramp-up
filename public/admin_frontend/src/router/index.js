import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Perfil from "../views/Perfil.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      layout: "fullscreen",
    },
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      layout: "menu",
    },
  },
  {
    path: "/meu-perfil",
    name: "Perfil",
    component: Perfil,
    meta: {
      layout: "menu",
      title: "Meu Perfil",
    },
  },
  {
    path: "/forms",
    name: "FormList",
    component: () => import("../views/FormList.vue"),
    meta: {
      layout: "menu",
      title: "Lista de Formulários",
    },
  },
  {
    path: "/forms/:formId",
    name: "FormSingle",
    component: () => import("../views/FormSingle.vue"),
    meta: {
      layout: "menu",
      title: "Formulário",
    },
  },
  {
    path: "/forms/:formId/categories/:categoryId",
    name: "FormSingleCategory",
    component: () => import("../views/FormSingleCategory.vue"),
    meta: {
      layout: "menu",
      title: "Formulário category",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const publicPages = ["/login", "/password-recovery"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("token");

  if (authRequired && !loggedIn) {
    next("/login");
  } else {
    next();
  }
});

export default router;
