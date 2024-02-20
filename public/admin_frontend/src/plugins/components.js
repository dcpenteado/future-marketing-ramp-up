import Vue from "vue";

const files = require.context('../components', false, /\.vue$/)

/**
 * Globally Register all components in the components folder
 */

files.keys().map(key => {
    const name = key.split('/').pop().split('.')[0]
    
    return Vue.component(name, files(key).default)
})