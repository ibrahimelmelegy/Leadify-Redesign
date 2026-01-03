<template lang="pug">
el-form-item( :label="label" :error='errorMessage' class="!mb-0")
    el-upload.avatar-uploader(action='#' v-loading="loading" :name="name" :drag='true' :http-request="handleUploadRequest" list-type='picture-card' :show-file-list="false" :on-success="handleUploadSuccess" :before-upload="beforeAvatarUpload" :class="{ 'small-size': sizeLook === 'small' }")

        ul.el-upload-list.el-upload-list--picture-card(v-if='inputValue')
          li.el-upload-list__item.is-ready(class="!m-0 rtl:!ml-0")
            LazyImg.w-full.el-upload-list__item-thumbnail(:src='inputValue')
            span.el-upload-list__item-actions
              span.el-upload-list__item-preview(@click.stop='handlePictureCardPreview()')
                el-icon
                  zoom-in
              span.el-upload-list__item-preview(@click.stop='handlePictureCardCrop()')
                el-icon
                  Crop
              span.el-upload-list__item-delete(v-if='!disabled' @click.stop='handleRemove()')
                el-icon
                  delete

        div.text-gray-400.flex.align-center.justify-center(v-if='!inputValue && !loading')
          el-icon.avatar-uploader-icon
            Icon(:name="icon")
          //- p.text-xs browse Or Drag

        template(#tip='')
          .el-upload__tip.flex.items-center.gap-1(v-if="note")
            Icon(name='iconamoon:information-circle')
            | {{note}}

    el-dialog(class='!bg-transparent  !shadow-none xl:!w-1/3 lg:!w-1/3 sm:!w-[90%] !w-full' v-model='dialogView')
      LazyImg(:src='inputValue' :key="dialogView" alt='Preview Image')

    el-dialog(v-model='dialogCrop' v-if="dialogCrop" :key="srcValue"  class=" px-5 xl:!w-1/3 lg:!w-1/3 !w-[90%]" align-center='' )
      Cropper(class="cropper"
        :key="srcValue"
        :src="runtimeConfig.public.BASE_URL + 'assets/' + srcValue"
        :stencil-props="{aspectRatio: 1/1}"
        :resizeImage="{ wheel: false }"
        ref="cropper")
      .flex.w-full.justify-between.mt-8
        el-button.w-full( size="large"  @click="dialogCrop= false") cancel
        el-button.w-full( size="large" type="primary" @click="cropImage") save
</template>

<script lang="ts" setup>
  import { computed, ref, watch, defineProps } from "vue";
  import { Delete, Download, Plus, ZoomIn, Crop } from "@element-plus/icons-vue";
  import type { UploadProps, UploadFile } from "element-plus";
  import { ElMessage } from "element-plus";
  import { useField } from "vee-validate";

  const props = defineProps({
    name: {
      type: String,
      default: "",
      required: false,
    },
    value: {
      type: String,
      default: "",
      required: false,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
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
        "image/jpg",
        "image/jpeg",
        "image/png",
        "image/webp",
        // "image/svg+xml",
      ],
      required: false,
    },
    type: {
      type: String,
    },
    note: {
      type: String,
    },
    sizeLook: {
      type: String,
    },
    model: {
      type: String,
      default: "PROJECT",
    },
  });

  const runtimeConfig = useRuntimeConfig();
  const srcValue = ref();

  const loading = ref(false);

  const icon = computed(() => {
    switch (props.type) {
      case "pdf":
        return "Download";
      case "image":
        return "IconImage";
      case "video":
        return "IconVideo";
      default:
        return "IconPlus";
    }
  });

  const handleUploadSuccess: UploadProps["onSuccess"] = (response: any, uploadFile: any) => {
    if (!response) return;
    inputValue.value = response;
    srcValue.value = inputValue.value;
  };

  const handleRemove = () => {
    inputValue.value = "";
  };

  const handleUploadRequest = async (params: any) => {
    loading.value = true;
    const { result, errorData } = await handleUploadRequestApi(params, "file", props.model);
    loading.value = false;

    if (errorData.value) {
      ElMessage.error(errorData.value || "Something went wrong");
      return;
    }

    inputValue.value = result.value;
  };

  const dialogImageUrl = ref("");
  const dialogView = ref(false);
  const handlePictureCardPreview = () => {
    dialogView.value = true;
  };

  const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile: any) => {
    if (!props.formats.includes(rawFile.type)) {
      ElMessage.error({
        message: `acceptUpload ${props.formats.map((format: any) => format.split("/").pop()).join(" , ")}`,
      });
      return false;
    } else if (rawFile.size / 1024 / 1024 > props.sizeInMb) {
      ElMessage.error("uploadMaxSize" + props.sizeInMb + "MB");
      return false;
    }
    return true;
  };

  const cropper = ref();
  const dialogCrop = ref(false);
  function handlePictureCardCrop() {
    !srcValue.value && (srcValue.value = inputValue.value);
    dialogCrop.value = true;
  }

  const cropImage = async () => {
    const { canvas } = cropper.value.getResult();
    if (canvas) {
      canvas.toBlob((blob: Blob) => {
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        // Handle the file upload request with the appropriate data
        handleUploadRequest({ file, data: { model: props.model } })
          .then(() => {
            ElMessage.success("Image cropped and uploaded successfully!");
            dialogCrop.value = false;
          })
          .catch((err) => {
            ElMessage.error("Failed to upload cropped image");
            console.error(err);
          });
      }, "image/jpeg");
    } else {
      ElMessage.error("Failed to crop image. Please try again.");
    }
  };

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
        inputValue.value = props.value;
      }
    }
  );

  watch(inputValue, () => {
    // if (!srcValue.value) {
    srcValue.value = inputValue.value;
    // }
  });
</script>

<style lang="scss">
  .avatar-uploader .el-upload {
    border: 1px dashed #d5c7ff;
    border-radius: $raduis-base;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }

  .avatar-uploader.small-size {
    .el-upload {
      width: 90px !important;
      height: 90px !important;
      .el-upload-dragger {
        width: 100% !important;
        height: 100% !important;
        background-color: #f2edff;
      }
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    text-align: center;
  }
  .el-upload-list__item-thumbnail {
    border-radius: $raduis-base;
  }
</style>
