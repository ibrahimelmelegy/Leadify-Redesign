<template lang="pug">
.webhooks-settings
  .flex.justify-between.items-center.mb-6
    div
      h1.text-2xl.font-bold.text-neutral-900 Webhooks
      p.text-neutral-500 Manage your webhook subscriptions and listeners
    
    el-button(type="primary" @click="openCreateDialog" :icon="Plus") Add Webhook

  el-card(v-loading="loading")
    el-table(:data="webhooks" style="width: 100%" empty-text="No webhooks configured")
      el-table-column(prop="name" label="Name" min-width="150")
      el-table-column(prop="url" label="Payload URL" min-width="250")
        template(#default="{ row }")
          .flex.items-center.gap-2
            span.font-mono.text-xs.bg-gray-100.px-2.py-1.rounded {{ row.url }}
      
      el-table-column(prop="status" label="Status" width="100")
        template(#default="{ row }")
          el-tag(:type="row.active ? 'success' : 'info'" size="small") {{ row.active ? 'Active' : 'Inactive' }}
      
      el-table-column(prop="events" label="Events" min-width="200")
        template(#default="{ row }")
          .flex.flex-wrap.gap-1
            el-tag(v-for="event in row.events" :key="event" type="info" size="small" effect="plain") {{ event }}
            
      el-table-column(label="Actions" width="150" align="right")
        template(#default="{ row }")
          el-dropdown(trigger="click")
            el-button(circle text :icon="MoreFilled")
            template(#dropdown)
              el-dropdown-menu
                el-dropdown-item(:icon="Edit" @click="openEditDialog(row)") Edit
                el-dropdown-item(:icon="Refresh" @click="regenerateSecret(row)") Regenerate Secret
                el-dropdown-item(:icon="Delete" class="text-red-500" @click="confirmDelete(row)") Delete

  //- Create/Edit Dialog
  el-dialog(
    v-model="dialogVisible"
    :title="isEditing ? 'Edit Webhook' : 'Add Webhook'"
    width="500px"
    destroy-on-close
  )
    el-form(
      ref="formRef"
      :model="form"
      :rules="rules"
      label-position="top"
    )
      el-form-item(label="Name" prop="name")
        el-input(v-model="form.name" placeholder="e.g. Production Data Sync")
        
      el-form-item(label="Payload URL" prop="url")
        el-input(v-model="form.url" placeholder="https://api.example.com/webhooks")
        
      el-form-item(label="Events" prop="events")
        el-select(v-model="form.events" multiple placeholder="Select events" style="width: 100%")
          el-option(label="lead.created" value="lead.created")
          el-option(label="lead.updated" value="lead.updated")
          el-option(label="deal.won" value="deal.won")
          el-option(label="deal.lost" value="deal.lost")
          el-option(label="client.created" value="client.created")
            
      el-form-item(label="Status" prop="active")
        el-switch(v-model="form.active" active-text="Active" inactive-text="Inactive")

    template(#footer)
      span.dialog-footer
        el-button(@click="dialogVisible = false") Cancel
        el-button(type="primary" @click="submitForm" :loading="submitting") {{ isEditing ? 'Update' : 'Create' }}

  //- Secret Display Dialog
  el-dialog(v-model="secretDialogVisible" title="Webhook Secret" width="400px")
    p.text-sm.text-gray-500.mb-4 Use this secret to verify signatures for payloads sent to this webhook.
    
    .bg-gray-50.p-4.rounded.border.flex.items-center.justify-between
      code.text-sm.text-indigo-600 {{ displayedSecret }}
      el-button(text :icon="CopyDocument" @click="copySecret" size="small")
    
    template(#footer)
      el-button(type="primary" @click="secretDialogVisible = false") Done

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Plus, MoreFilled, Edit, Delete, Refresh, CopyDocument } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';

definePageMeta({
  layout: 'default'
});

interface Webhook {
  id: number;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

const loading = ref(false);
const submitting = ref(false);
const webhooks = ref<Webhook[]>([]);
const dialogVisible = ref(false);
const isEditing = ref(false);
const formRef = ref();

// Secret handling
const secretDialogVisible = ref(false);
const displayedSecret = ref('');

const form = reactive({
  id: null as number | null,
  name: '',
  url: '',
  events: [] as string[],
  active: true
});

const rules = {
  name: [{ required: true, message: 'Please enter a name', trigger: 'blur' }],
  url: [
    { required: true, message: 'Please enter a URL', trigger: 'blur' },
    { type: 'url', message: 'Please enter a valid URL', trigger: 'blur' }
  ],
  events: [{ required: true, message: 'Please select at least one event', trigger: 'change' }]
};

onMounted(() => {
  fetchWebhooks();
});

async function fetchWebhooks() {
  loading.value = true;
  try {
    const data = await useApiFetch('webhooks');
    webhooks.value = data.webhooks;
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to fetch webhooks');
  } finally {
    loading.value = false;
  }
}

function openCreateDialog() {
  isEditing.value = false;
  form.id = null;
  form.name = '';
  form.url = '';
  form.events = [];
  form.active = true;
  dialogVisible.value = true;
}

function openEditDialog(row: Webhook) {
  isEditing.value = true;
  form.id = row.id;
  form.name = row.name;
  form.url = row.url;
  form.events = [...row.events];
  form.active = row.active;
  dialogVisible.value = true;
}

async function submitForm() {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      submitting.value = true;
      try {
        if (isEditing.value && form.id) {
          await useApiFetch(`webhooks/${form.id}`, 'PUT', { ...form });
          ElMessage.success('Webhook updated successfully');
        } else {
          const res = await useApiFetch('webhooks', 'POST', { ...form });
          ElMessage.success('Webhook created successfully');
          if (res.webhook?.secret) {
            displayedSecret.value = res.webhook.secret;
            secretDialogVisible.value = true;
          }
        }
        dialogVisible.value = false;
        fetchWebhooks();
      } catch (error: any) {
        ElMessage.error(error.message || 'Operation failed');
      } finally {
        submitting.value = false;
      }
    }
  });
}

function confirmDelete(row: Webhook) {
  ElMessageBox.confirm(
    'Are you sure you want to delete this webhook?',
    'Warning',
    {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(async () => {
    try {
      await useApiFetch(`webhooks/${row.id}`, 'DELETE');
      ElMessage.success('Webhook deleted');
      fetchWebhooks();
    } catch (error: any) {
      ElMessage.error(error.message || 'Delete failed');
    }
  });
}

async function regenerateSecret(row: Webhook) {
  try {
    const res = await useApiFetch(`webhooks/${row.id}/regenerate-secret`, 'POST');
    displayedSecret.value = res.secret;
    secretDialogVisible.value = true;
    ElMessage.success('Secret regenerated');
  } catch (error: any) {
    ElMessage.error(error.message || 'Operation failed');
  }
}

function copySecret() {
  navigator.clipboard.writeText(displayedSecret.value);
  ElMessage.success('Copied to clipboard');
}
</script>

<style scoped>
.webhooks-settings {
  padding: 24px;
}
</style>
