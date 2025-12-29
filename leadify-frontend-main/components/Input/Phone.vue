<template lang="pug">
el-form-item(:label="label"  :error='errorMessage' class="!mb-6")
  vue-tel-input.form-control.w-full( :disabled="disabled" v-model="phoneNumber"  :inputOptions="{type : 'tel', placeholder: placeholder ? placeholder : 'enter' + label}"  :dropdownOptions="{showSearchBox : true , showFlags:true , showDialCodeInSelection: true , showDialCodeInList: true }"   @validate="validatecode"   :validCharactersOnly="true"  placeholder="12 123 45 67"  mode="international"  @input="handleChange" @blur="handleBlur"  :class="{'is-invalid': errorMessage, valid: meta.valid , 'p-invali-input': errorMessage  }"  defaultCountry="EG")
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import { object } from 'yup';
const phoneNumber = ref();
const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  successMessage: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: '',
  },
  mask: {
    type: String,
    default: '',
  },
  labelStyle: {
    type: Object,
    default: {},
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  padding: {
    type: Number,
    default: 0.5,
  },
});
const emit = defineEmits(['validphone', 'value']);
const name = toRef(props, 'name');
const validphone = ref(true);
const errorPhone = ref('');

const validPhone = ref(true);

function validatecode(event: any, submit: any) {
  if (event) {
    validPhone.value = event.valid;
    emit('validphone', validPhone.value);
  }
}

const tels = ref({
  placeholder: 'phonePlaceholder',
});
const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(name, undefined, {
  initialValue: props.value,
});
watch(
  () => props.value,
  () => {
    if (props.value) {
      inputValue.value = props.value;
      phoneNumber.value = inputValue.value;
    }
  }
);
phoneNumber.value = inputValue.value;

watch(
  () => phoneNumber.value,
  () => {
    emit('value', phoneNumber.value);
  }
);
</script>

<style lang="scss">
.vue-tel-input {
  border-radius: 1rem !important;
  border: 1px solid $info !important;
  height: $height-input;
  transition: all 0.5s ease;
  &:hover {
    border-color: $primary !important;
  }
  &:focus-within {
    border-color: $primary !important;
    box-shadow: none !important;
  }
}

.vti__dropdown-item {
  padding-left: 0;
  padding-right: 0;
}

.vti__search_box {
  width: 100% !important;
  border-radius: 1rem !important;
  border-bottom: 1px solid #ccc;
  margin: 0;
}
.vti__dropdown {
  border-radius: 1rem;
  padding: 0.2rem 1rem;
}
input.vti__input {
  border-top-right-radius: 1rem !important;
  border-bottom-right-radius: 1rem !important;
}
.vti__dropdown-list.below,
.vti__dropdown-list.above {
  border-radius: 1rem !important;
  padding: 12px;
}
.el-form-item.is-error {
  .vue-tel-input {
    border-color: $error !important;
  }
}
</style>
