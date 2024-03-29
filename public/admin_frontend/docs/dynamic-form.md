# Dynamic form

This document describes how the dynamic form is implemented in the application.

## Introduction

The `DynamicForm` is aa component render multiple fields based on the questions & answers array.

The questions is used to define the fields that will be rendered in the form.

And the answers is used to show previous answers in the form and allow the user to restore the field value

## Usage
    
```html
<template>
    <DynamicForm v-model="data" :questions="questions" :answers="answers" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue'

export default {
    components: {
        DynamicForm
    },
    data() {
        return {
            data: {},
            questions: [],
            answers: []
        }
    }
}
</script>
```

Data property will be defined in the following format:

```json
{
    "[question_id]": "[value]"
}
```

## Question Array

This is an example of the input expected

```json
[
    {
        "id": "1",
        "name": "Normal",
        "type": "text",
        "description": "Texto normal"
    },
]

```

## Answers Array

This is an example of the input expected

```json
[
  {
    "category_id": "1",
    "question_id": "1",
    "versions": [
      {
        "value": "teste",
        "origin": "user",
        "createdBy": "65baa73019c4d1ee4896a318",
        "createdAt": "2024-02-06T16:47:24.007Z"
      },
    ]
  }
]

```

## Conditional fields

To create a conditional field, you need to add the `config.conditions` array inside the question object.

```json
{
    "id": "1",
    "name": "Normal",
    "type": "text",
    "description": "Texto normal",
    "config": {
        "if": [
            "{{ currentAnswers['2'] === '1' }}",
        ]
    }
}
```

This will make the field visible only if the value of the field with id 2 is equal to 1.


## Validation

Any field can be validated using the `config.rules` array inside the question object.

Ex:

```json
{
    "id": "1",
    "name": "Normal",
    "type": "text",
    "description": "Texto normal",
    "config": {
        "rules": [
            { "type": "required" }
        ]
    }
}
```

To know the list of available rules, please check the [useValidation.js](../src/composables/useValidation.js) file.


## DynamicFieldText

To tell the form to render a text, just add a questions with type text inside the questions array.

```json
{
    "id": "1",
    "name": "Normal",
    "type": "text",
    "description": "Texto normal"
}
```

## DynamicFieldSelect

To tell the form to render a select, just add a questions with type select inside the questions array.

Also, you need to add the `config.options` array to define the options that will be rendered.

```json
{
    "id": "1",
    "name": "Select",
    "type": "select",
    "description": "Select normal",
    "config": {
        "options": [
            { "text": "Option 1", "value": "1" },
            { "text": "Option 2", "value": "2" }
        ]
    }
}
```

## DynamicFieldAutocomplete
Similar to the select, just add a questions with type autocomplete inside the questions array and define the `config.options`.

```json
{
    "id": "1",
    "name": "Autocomplete",
    "type": "autocomplete",
    "description": "Autocomplete normal",
    "config": {
        "options": [
            { "text": "Option 1", "value": "1" },
            { "text": "Option 2", "value": "2" }
        ]
    }
}
```

### Filtering

To filter options based on other field you can use the `config.filter` array.

```json
[
    {
        "id": "1",
        "name": "Field with primary list",
        "type": "autocomplete",
        "description": "description",
        "config": {
            "items": [
                { "text": "List 1", "value": "1" },
                { "text": "List 2", "value": "2" },
                { "text": "List 3", "value": "4" }
            ]
        }
    },
    {
        "id": "2",
        "name": "Field with secondary list",
        "type": "autocomplete",
        "description": "description",
        "config": {
            "items": [
                { "text": "Item 1 (list 1)", "value": "1", "list": "1" },
                { "text": "Item 2 (list 1)", "value": "2", "list": "1" },
                { "text": "Item 3 (list 1)", "value": "3", "list": "1" },
                { "text": "Item 1 (list 2)", "value": "4", "list": "2" },
                { "text": "Item 2 (list 2)", "value": "5", "list": "2" },
                { "text": "Item 3 (list 2)", "value": "6", "list": "2" },
                { "text": "Item 1 (list 3)", "value": "7", "list": "3" },
                { "text": "Item 2 (list 3)", "value": "8", "list": "3" },
                { "text": "Item 3 (list 3)", "value": "9", "list": "3" }
            ],
            "filter": {
                "list": "{{ currentAnswers['1'] }}"
            }
        }
    }
]
```

In this example, the second field will be filtered based on the value of the first field.

`currentAnswers` is a reactive object that contains the current value of the form.

## DynamicFieldRadio
```json
{
    "id": "1",
    "name": "Radio",
    "type": "radio",
    "description": "Radio normal",
    "config": {
        "options": [
            { "text": "Option 1", "value": "1" },
            { "text": "Option 2", "value": "2" }
        ]
    }
}
```

## DynamicFieldCheckbox
```json
{
    "id": "1",
    "name": "Checkbox",
    "type": "checkbox",
    "description": "Checkbox normal",
    "config": {
        "options": [
            { "text": "Option 1", "value": "1" },
            { "text": "Option 2", "value": "2" }
        ]
    }
}
```

## Custom fields

If none of the above fields meet your needs, you can create a custom field.

To do this, you need to create a new component ex: `DynamicFormFieldMyCustomField` component.

```html
<template>
    <div>
        Custom field
    </div>
</template>

<script>
export default {
    props: {
        question: {
            type: Object,
            required: true
        },
        model: {
            type: Object,
            required: true
        },
        errors: {
            type: Object,
            required: true
        }
    }
}
</script>
```

And add it to the `DynamicFormField` component.

```html
<template>
    ...
    <DynamicFormFieldTextarea
        v-else-if="question.type === 'textarea'"
        v-model="model"
        :question="question"
        :errors="errors"
    />

    <DynamicFormFieldMyCustomField
        v-else-if="question.type === 'my_custom_component'"
        v-model="model"
        :question="question"
        :errors="errors"
    />
    ...
</template>

<script>
export default {
    ...
    components: {
        ...
        DynamicFormFieldTextarea: () => import('@/components/DynamicFormFieldTextarea.vue')
        DynamicFormFieldMyCustomField: () => import('@/components/DynamicFormFieldMyCustomField.vue')
    }
    ...
}
</script>
```

```json
{
    "id": "1",
    "name": "My Custom Field",
    "type": "my_custom_component",
    "description": "My custom field description"
}
```

## MarkAsEmpty

Some fields may be optional for the user to fill in, but the system needs to know if the user has seen the field or not.

To allow the user do this, you can add the `config.allowMarkAsEmpty` property to the question object.

```json
{
    "id": "1",
    "name": "Normal",
    "type": "text",
    "description": "Texto normal",
    "config": {
        "allowMarkAsEmpty": true
    }
}
```

This will add a checkbox to the field that allows the user to mark the field as empty.
