<template lang="pug">
el-form-item(:label="label" :error='errorMessage' class="!mb-6")
        QuillEditor.w-full( v-model:content="inputValue" :name="name" :modules="uploadImagEditor()"  :placeholder='placeholder ? placeholder : "enter" + label' content-type="html"  toolbar="full" )
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
import ImageUploader from 'quill-image-uploader';
const contentImagesUrls = ref([]);
const props = defineProps({
  type: {
    type: String,
    default: 'text',
    required: false,
  },
  name: {
    type: String,
    default: '',
    required: false,
  },
  append: {
    type: Boolean,
  },
  value: {
    type: String,
    default: '',
    required: false,
  },

  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
    required: false,
  },
  optional: {
    type: Boolean,
    default: false,
    required: false,
  },
  model: {
    type: String,
  },
});
function uploadImagEditor() {
  return {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
      upload: async (filename) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { success, data } = await uploadFile(props.model, filename);
            contentImagesUrls.value.push(data);
            resolve(useRuntimeConfig().public.BUCKET_URL + data);
          } catch (error) {
            reject('Upload failed');
            console.error('Error:', error);
          }
        });
      },
    },
  };
}

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value,
});

watch(
  () => props.value,
  () => {
    if (props.value) {
      inputValue.value = props.value; // set value from parent
    }
  }
);

watch(inputValue, () => {
  {
    if (inputValue.value === '<p><br></p>') {
      inputValue.value = '';
    }
  }
});
</script>

<style lang="scss">
.ql-editor {
  min-height: 160px;
  //   border: 1px solid #d1d5db;
  //   border-top: none;
}
.ql-container {
  border-radius: 0 0 $raduis-base $raduis-base !important;
}
.ql-toolbar {
  border-radius: $raduis-base $raduis-base 0 0 !important;
  width: 100%;
}

.is-error {
  .ql-container,
  .ql-toolbar {
    border-color: $error;
  }
}

.ql-active,
.ql-selected {
  background-color: $primary-light !important ;
  color: $primary !important;
}
.ql-fill {
  fill: $primary !important;
}
.ql-stroke {
  stroke: $primary !important;
}
</style>
