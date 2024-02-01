import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/lib/Api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentUser: null,
        breadcrumbs: [],
        pageTitle: 'Future Marketing',
        pageLoading: false
    },
    mutations: {
        setCurrentUser(state, payload) {
            state.currentUser = payload
        },
        setBreadcrumbs(state, payload) {
            state.breadcrumbs = payload
        },
        setPageTitle(state, payload) {
            state.pageTitle = payload

            document.title = payload || 'Future Marketing'
        },
        setPageLoading(state, payload) {
            state.pageLoading = payload
        }
    },
    actions: {
        async loadCurrentUser({ commit }) {
            const user = await Api.getRemoteUser();

            commit('setCurrentUser', user)
        }
    },
})