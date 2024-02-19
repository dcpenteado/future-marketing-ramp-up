import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/lib/Api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentUser: null,
        breadcrumbs: [],
        drawerMenuItems: [],
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
})