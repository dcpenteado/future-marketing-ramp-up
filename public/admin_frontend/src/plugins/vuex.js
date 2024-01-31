import Vue from 'vue'
import Vuex from 'vuex'
import Api from '@/lib/Api'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currentUser: null,
    },
    mutations: {
        setCurrentUser(state, payload) {
            state.currentUser = payload
        }
    },
    actions: {
        async loadCurrentUser({ commit }) {
            const user = await Api.getRemoteUser();

            commit('setCurrentUser', user)
        }
    },
})