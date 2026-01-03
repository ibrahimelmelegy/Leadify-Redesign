<template lang="pug">
el-dialog(
  v-model="visible"
  :title="title"
  width="400px"
  :close-on-click-modal="false"
  center
)
  .text-center
    .flex.justify-center.mb-4
      .w-16.h-16.rounded-full.flex.items-center.justify-center(
        :class="iconBgClass"
      )
        Icon(:name="iconName" size="32" :class="iconClass")
    p.text-gray-600.mb-4 {{ message }}
  template(#footer)
    .flex.justify-center.gap-3
      el-button(
        size="large"
        @click="handleCancel"
        class="!rounded-xl !px-8"
      ) {{ cancelText }}
      el-button(
        size="large"
        :type="confirmType"
        :loading="loading"
        @click="handleConfirm"
        class="!rounded-xl !px-8"
      ) {{ confirmText }}
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Action'
  },
  message: {
    type: String,
    default: 'Are you sure you want to proceed?'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmType: {
    type: String as () => 'primary' | 'danger' | 'warning' | 'success',
    default: 'primary'
  },
  variant: {
    type: String as () => 'delete' | 'warning' | 'info',
    default: 'warning'
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const iconName = computed(() => {
  switch (props.variant) {
    case 'delete':
      return 'IconDelete';
    case 'warning':
      return 'IconWarning';
    default:
      return 'IconInfo';
  }
});

const iconBgClass = computed(() => {
  switch (props.variant) {
    case 'delete':
      return 'bg-red-100';
    case 'warning':
      return 'bg-yellow-100';
    default:
      return 'bg-blue-100';
  }
});

const iconClass = computed(() => {
  switch (props.variant) {
    case 'delete':
      return 'text-red-500';
    case 'warning':
      return 'text-yellow-500';
    default:
      return 'text-blue-500';
  }
});

function handleConfirm() {
  emit('confirm');
}

function handleCancel() {
  visible.value = false;
  emit('cancel');
}
</script>
