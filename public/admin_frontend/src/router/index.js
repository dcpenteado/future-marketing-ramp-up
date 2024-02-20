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
    path: "/customers",
    name: "Customers",
    component: () => import("../views/Customers.vue"),
    meta: {
      layout: "menu",
      title: "Clientes",
    },
  },
  {
    path: "/administrators",
    name: "Administrators",
    component: () => import("../views/Administrators.vue"),
    meta: {
      layout: "menu",
      title: "Administradores",
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
    path: "/forms/:formId/prompts",
    name: "FormPromptList",
    component: () => import("../views/FormPromptList.vue"),
    meta: {
      layout: "menu",
      title: "Lista de Prompts",
    },
  },
  {
    path: "/forms/:formId/elements",
    name: "FormElementList",
    component: () => import("../views/FormElementList.vue"),
    meta: {
      layout: "menu",
      title: "Lista de Elementos",
    },
  },
  {
    path: "/form-responses",
    component: () => import("../views/FormResponseList.vue"),
    meta: {
      title: "Respostas",
      layout: "menu",
    },
  },
  {
    path: "/form-responses/:formResponseId",
    name: "FormResponseSingle",
    component: () => import("../views/FormResponseSingle.vue"),
    meta: {
      layout: "menu",
      title: "Formulário",
    },
  },
  {
    path: "/form-responses/:formResponseId/categories/:categoryId",
    name: "FormResponseSingleCategory",
    component: () => import("../views/FormResponseSingleCategory.vue"),
    meta: {
      layout: "menu",
      title: "Formulário",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("../views/404.vue"),
    meta: {
      layout: "menu",
      title: "Página não encontrada",
    },
  }
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
