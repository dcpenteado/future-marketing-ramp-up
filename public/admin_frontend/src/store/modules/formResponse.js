import Api from "@/lib/Api";

export default {
    namespaced: true,
    state: {
        items: []
    },
    mutations: {
        setItems(state, payload) {
            state.items = payload
        }
    },
    actions: {
        async load({ commit }) {
            const response = await Api.getFormResponses();

            if (response.error) return

            commit('setItems', response.message)
        }
    }
}