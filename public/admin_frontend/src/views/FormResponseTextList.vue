<template>
    <div>
        <v-row>
            <v-col cols="12" class="sticky">
                <v-card>
                    <v-card-text class="d-flex align-center">
                        
                        <div>
                            {{ form?.name }}
                        </div>

                        <v-spacer></v-spacer>
                        <v-btn color="primary" :loading="saving" @click="save">
                            Salvar
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" v-for="(text, index) in texts" :key="index">
                <field-card :title="text.description">
                    <template #header-actions>
                        <div class="d-flex">
                            <v-spacer ></v-spacer>
        
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <v-btn
                                        tabindex="-1"
                                        icon
                                        v-on="on"
                                        @click="showVersions(index)"
                                    >
                                        <v-icon>mdi-history</v-icon>
                                    </v-btn>
                                </template>
                                <span>Ver versões</span>
        
                            </v-tooltip>
                        </div>
                    </template>
        
                    <v-textarea
                        outlined
                        v-model="text.value"
                    />
            
                </field-card>
            </v-col>
        </v-row>

        <v-navigation-drawer
            v-model="drawer"
            right
            app
            width="500"
            temporary
        >

            <template v-slot:prepend>
                <div class="d-flex pa-4 align-center">
                    <v-toolbar-title>
                        Versões
                    </v-toolbar-title>
    
                    <v-spacer></v-spacer>
    
                    <v-btn
                        icon
                        @click="drawer = false"
    
                    >
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
                <v-divider></v-divider>
            </template>

            <v-card-text v-if="selectedVersion" style="background-color: #2524380f;min-height:100%">
                <v-row class="overflow-y-auto">
                    <v-col cols="12" v-if="!selectedVersion.versions">
                        <v-card-title class="break-words">
                            Nenhuma versão encontrada
                        </v-card-title>
                    </v-col>
                    
                    <v-col cols="12" v-for="(v, i) in selectedVersion.versions" :key="i">
                        <field-card
                            :title="`Versão ${i + 1} (${v.origin})`"
                            disabled
                            type="textarea"
                            :description="$date.format(v.createdAt)"
                        >

                            <template #header>                                
                                <v-row dense align="center">
                                    <v-col cols="12" sm="6">                                            
                                        <v-card-title class="pa-0 ma-0">
                                            Versão {{ i + 1 }} - {{ v.origin }}
                                        </v-card-title>
                                        <v-card-subtitle class="pa-0 ma-0">
                                            {{ $date.format(v.createdAt) }}
                                        </v-card-subtitle>                                            
                                    </v-col>
                                    
                                    <v-col cols="12" sm="6">
                                        <v-btn block color="primary" @click="restoreVersion(v.value)">
                                            Restaurar
                                        </v-btn>
                                    </v-col>    
                                </v-row>
                            </template>

                            <v-textarea readonly outlined :value="v.value" />                    
                        </field-card>
                    </v-col>
                </v-row>
            </v-card-text>
        
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: 'FormResponseTextList',
    data: () => ({
        drawer: false,
        saving: false,
        formResponse: null,
        form: null,
        user: null,
        texts: [],
        selectedIndex: null,
    }),
    computed: {
        pageLoading: {
            get() {
                return this.$store.state.pageLoading;
            },
            set(value) {
                this.$store.commit('setPageLoading', value);
            }
        },
        formResponseId() {
            return this.$route.params.formResponseId
        },
        selectedVersion() {
            return this.texts[this.selectedIndex];
        },
        isAdmin(){
            return this.$store.getters.isAdmin;
        }
    },
    methods: {
        setPageData() {
            this.$store.commit('setPageTitle', this.form.name);
            this.$store.commit('setPageSubtitle', this.user.name);

            const items = [
                { label: this.form.name },
                { label: 'Textos' },
            ]

            if (this.isAdmin) {
                items.unshift({ label: 'Sites', to: '/form-responses' })
            }

            this.$store.commit('setBreadcrumbs', items)
        },
        setTexts(){
            this.texts = this.formResponse.ramp_up_texts.map(t => {
                const lastVersion = t.versions.at(-1);

                return {
                    id: t.id,
                    description: t.description,
                    value: lastVersion?.value,
                    versions: t.versions,
                }
            })
        },
        async setFormResponse(){
            const response = await this.$api.getFormResponseById(this.$route.params.formResponseId);

            if (response.error) {
                return response
            }

            this.formResponse = response.message;
            this.form = response.message.form;
            this.user = response.message.user;

            this.setTexts();
            this.setPageData();

            return response;
        },
        async load() {
            this.pageLoading = true;

            const response = await this.setFormResponse();

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            setTimeout(() => {
                this.pageLoading = false;
            }, 200);
        },
        showVersions(index) {
            this.selectedIndex = index;
            this.drawer = true;
        },
        restoreVersion(value) {
            this.texts = this.texts.map((t, i) => {
                if (i === this.selectedIndex) {
                    return {
                        ...t,
                        value
                    }
                }

                return t;
            })

            this.drawer = false;
        },
        async save(){
            this.saving = true;

            const response = await this.$api.createFormResponseTexts(this.formResponseId, this.texts);

            if (response.error) {
                this.saving = false;
                return;
            }

            await this.setFormResponse();

            this.$toast('success', 'Salvo com sucesso');

            setTimeout(() => {
                this.saving = false;
            }, 2000);
        }
    },
    watch: {
        drawer(){
            if (!this.drawer) {
                this.selectedIndex = null;
            }
        },
        formResponseId: {
            handler: 'load',
            immediate: true
        }
    }
}
</script>