<template>
  <Form @submit="onSubmit">
    <div
      v-for="{ as, name, label, children, ...attrs } in schema.fields"
      :key="name"
    >
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" :value="formData[name]" v-on="inputListeners" v-bind="attrs">
        <template v-if="children && children.length">
          <component v-for="({ tag, text, ...childAttrs }, idx) in children"
            :key="idx"
            :is="tag"
            v-bind="childAttrs"
          >
            {{ text }}
          </component>
        </template>
      </Field>
      <ErrorMessage :name="name" />
    </div>
    <button type="submit">Submit</button>
  </Form>
</template>
<script>
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  name: 'DynamicForm',
  components: {
    Form,
    Field,
    ErrorMessage
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    formData: {
      get() {
        return this.value;
      },
      set(newValue) {
        this.$emit('input', newValue);
      },
    },
    inputListeners() {
      const vm = this;
      return {
        input(event) {
          vm.$emit('input', {
            ...vm.formData,
            [event.target.name]: event.target.value,
          });
        },
      };
    },
  },
  methods: {
    onSubmit() {
        console.log('enviando')
      this.$emit('submit');
    },
  },
};
</script>
