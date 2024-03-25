<template>    
    <v-row>
        <v-col cols="12" v-if="errors.length">
            <v-alert type="error">
                {{ errors[0] }}
            </v-alert>
        </v-col>

        <v-col
            cols="12" v-for="(i) in items" :key="i.id"
            class="d-flex align-center"
        >
            <v-text-field
                v-model="model.value[i.id]" outlined hide-details="auto"
                :readonly="readonly"
                @blur="model = model"
            />

            <v-btn v-if="!readonly" @click="removeItem(i.id)" class="mx-2" height="56" text color="error" tabindex="-1">
                <v-icon>mdi-delete</v-icon>
            </v-btn>
        </v-col>

        <v-col
            v-if="!readonly"
            cols="12"
            :class="!items.length ? 'text-center' : ''"
        >
            <v-btn color="primary" @click="addItem">
                Adicionar item
            </v-btn>
        </v-col>
    </v-row>
</template>

<script>
export default {
    name: 'DynamicFormFieldListItem',
    props: {
        value: {
            type: Object,
            default: () => ({
                value: null
            })
        },
        question: {
            type: Object,
            required: true
        },
        errors: {
            type: Array,
            default: () => []
        },
        readonly: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        model: {
            get() {
                return this.value;
            },
            set(value) {
                if (!Array.isArray(value.value)) {
                    this.$emit('input', value.value)
                    return
                }

                const onlyFilled = value.value.filter((item) => !!item)

                this.$emit('input', {
                    ...value,
                    value: onlyFilled
                });
            }
        },
        items() {
            if (!Array.isArray(this.model.value)) return []

            return this.model.value.map((item, index) => ({
                id: index
            }))            
        },
    },
    methods: {
        addItem() {
            const label = 'Item ' + ((this.model.value?.length ?? 0) + 1)
            
            if (!Array.isArray(this.model.value)) {
                this.model.value = [label]
                return
            }
            

            this.model.value.push(label)
        },
        removeItem(index) {
            if (!Array.isArray(this.model.value)) {
                return
            }

            this.model.value.splice(index, 1)
        }
    }
}
</script>