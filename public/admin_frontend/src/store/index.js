import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/lib/Api'

Vue.use(Vuex)

const files = require.context('./modules', false, /\.js$/)

const modules = files.keys().reduce((acc, key) => {
    const name = key.replace(/(\.\/|\.js)/g, '')
    const module = files(key).default

    acc[name] = module

    return acc
}, {})


export default new Vuex.Store({
    modules,
    state: {
        currentUser: null,
        breadcrumbs: [],
        drawerMenuItems: [],
        formResponseEnum: {
            NEW: 0,
            FILLING: 1,
            FILLING_DONE: 2,
            AI_PROCESSING: 3,
            AI_PROCESSED: 4,
            INTERNAL_REVIEW: 5,
            CUSTOMER_REVIEW: 6,
            FINAL_REVIEW: 7,
            APPROVED: 8,
            FINISHED: 9
        },
        form_response_statuses: {
            0: "Novo",
            1: "Preenchendo formulário",
            2: "Formulário pronto",
            3: "Processando",
            4: "Processado pela IA",
            5: "Revisão interna",
            6: "Revisão do cliente",
            7: "Revisão final",
            8: "Aprovado para site",
            9: "Finalizado"
        },
        pageTitle: 'Future Marketing',
        pageSubtitle: '',
        pageLoading: false,
        dialog: {
            show: false,
            title: '',
            message: '',
            resolve: null
        },
    },
    mutations: {
        setCurrentUser(state, payload) {
            state.currentUser = payload
        },
        setBreadcrumbs(state, payload) {
            state.breadcrumbs = payload
        },
        setDrawerMenuItems(state, payload) {
            state.drawerMenuItems = payload
        },
        setPageTitle(state, payload) {
            state.pageTitle = payload

            document.title = payload || 'Future Marketing'
        },
        setPageSubtitle(state, payload) {
            state.pageSubtitle = payload
        },
        setPageLoading(state, payload) {
            state.pageLoading = payload
        },
        setDialog(state, payload) {
            state.dialog = payload
        },
    },
    actions: {
        async loadCurrentUser({ commit }) {
            const user = await Api.getRemoteUser();

            commit('setCurrentUser', user)
        },
        async confirmDialog({ commit }, payload) {
            return new Promise((resolve) => {
                commit('setDialog', {
                    show: true,
                    title: payload?.title || 'Confirmar ação',
                    message: payload?.message || 'Você tem certeza que deseja realizar esta ação?',
                    resolve
                })
            })
        }
    },
    getters: {
        isAdmin(state) {
            return !!state.currentUser?.admin
        }
    }
})