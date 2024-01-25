import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                // vuetify colors
                primary: '#7069A1',

                // custom colors
                galaxy: '#7069A1',
                stardust: '#0F151C'
            }
        }
    }
});
