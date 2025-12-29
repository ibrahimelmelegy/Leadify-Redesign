<template lang="pug">
el-form-item(:label="label" :error='errorMessage' class="!mb-6")
  el-upload.w-fit.list-upload.avatar-uploader(v-model:file-list='inputValue' action='#' :name="name" :on-success="handleUploadSuccess"   v-loading="loading" :http-request="handleUploadRequest"  :before-upload="beforeUpload" list-type='picture-card' )
    div.text-gray-400.text-center
          el-icon.avatar-uploader-icon
              Icon(:name="icon")
          p.text-xs browse Or Drag

    template(#tip='')
            .el-upload__tip.flex.items-center.gap-1(v-if="note")
              Icon(name='iconamoon:information-circle')
              | {{note}}
    template(#file='{ file }')
      div.w-full
        LazyImg.el-upload-list__item-thumbnail.m-auto(:src='file?.response' alt='')
        span.el-upload-list__item-actions
          span.el-upload-list__item-preview(@click='handlePictureCardPreview(file)')
            el-icon
              zoom-in
          span.el-upload-list__item-delete(v-if='!disabled' @click='handleRemove(file)')
            el-icon
              delete
  el-dialog(class='!bg-transparent  !shadow-none xl:!w-1/3 lg:!w-1/3 sm:!w-[90%] !w-full' v-model='dialogVisible')
      LazyImg( :src='dialogImageUrl' alt='Preview Image')

</template>

<script lang="ts" setup>
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import type { UploadProps, UploadUserFile } from 'element-plus';
import type { UploadFile } from 'element-plus';
import { useField } from 'vee-validate';

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: false,
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
  sizeInMb: {
    type: Number,
    default: 2, //2mb
  },
  formats: {
    type: Array,
    default: [
      'image/jpg',
      'image/jpeg',
      'image/png',
      // "image/webp",
      // "image/svg+xml",
    ],
    required: false,
  },
  type: {
    type: String,
  },
});

const icon = computed(() => {
  switch (props.type) {
    case 'file':
      return 'IconAdd';
    case 'image':
      return 'IconImage';
    case 'video':
      return 'IconVideo';
    default:
      return 'IconImageList';
  }
});

const runtimeConfig = useRuntimeConfig();

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
const loading = ref(false);

const handleUploadRequest = async (params: any) => {
  loading.value = true;
  const { success, data } = await uploadFile('LECTURER_CV_FILE', params.file);

  loading.value = false;
  return data;
};

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (!props.formats.includes(rawFile.type)) {
    ElMessage.error({
      message: `acceptUpload ${props.formats.map((format) => format.split('/').pop()).join(' , ')}`,
    });
    return false;
  } else if (rawFile.size / 1024 / 1024 > props.sizeInMb) {
    ElMessage.error('uploadMaxSize' + props.sizeInMb + 'MB');
    return false;
  }
  return true;
};

const handleRemove = (file: UploadFile) => {
  inputValue.value.splice(inputValue.value.indexOf(file), 1);
};

const handleUploadSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {};

const {
  value: inputValue,
  errorMessage,
  handleBlur,
  handleChange,
  meta,
} = useField(props.name, undefined, {
  initialValue: props.value ? props.value : [],
});
watchEffect(() => {
  if (props.value) {
    inputValue.value = props.value;
  }
});
if (props.value) {
  inputValue.value = props.value;
}
</script>

<style lang="scss">
.el-upload-list {
  &--picture-card {
    .el-upload-list__item {
      border-radius: $raduis-base;
    }
  }
}
</style>
