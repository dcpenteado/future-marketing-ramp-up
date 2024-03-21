<template>
    <div>
        <v-row>
            <v-col cols="12" v-for="(text, index) in texts" :key="index">
                <field-card
                    
                    :title="text.description"
                >
        
                    <v-textarea
                        outlined
                        v-model="text.value"
                        readonly
                    />
            
                </field-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: 'FormResponseTextList',
    data: () => ({
        formResponse: null,
        form: null,
        user: null,
        texts: []
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
    },
    methods: {
        setPageData() {
            this.$store.commit('setPageTitle', this.form.name);
            this.$store.commit('setPageSubtitle', this.user.name);

            this.$store.commit('setBreadcrumbs', [
                { label: this.form.name },
            ])
        },
        setTexts(){
            this.texts = this.formResponse.ramp_up_texts.map(t => {
                const lastVersion = t.versions.at(-1);

                return {
                    description: t.description,
                    value: lastVersion?.value
                }
            })
        },
        async load() {
            this.pageLoading = true;

            const response = await this.$api.getFormResponseById(this.$route.params.formResponseId);

            if (response.error) {
                this.pageLoading = false;
                this.$router.push('/404');
                return
            }

            this.formResponse = response.message;
            this.form = response.message.form;
            this.user = response.message.user;

            this.setTexts();
            this.setPageData();

            setTimeout(() => {
                this.pageLoading = false;
            }, 200);
        },
    },
    watch: {
        formResponseId: {
            handler: 'load',
            immediate: true
        }
    }
}
</script>