import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import ptBr from 'vuetify/lib/locale/pt';

Vue.use(Vuetify);

export default new Vuetify({
    lang: {
        current: 'ptBr',
        locales: { ptBr }
    },
    theme: {
        options: {
            customProperties: true
        },
        themes: {
            light: {
                // vuetify colors
                primary: '#7069A1',

                // design colors
                galaxy: '#7069A1',
                stardust: '#0F151C',
                moon: '#B7B5CF',                

                // others
                mercury: '#495057'               
                
            }
        }
    }
});
