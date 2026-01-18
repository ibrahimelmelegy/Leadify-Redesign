<template lang="pug">
.security-settings
  h1 Security Settings
  
  el-tabs(v-model="activeTab")
    el-tab-pane(label="Two-Factor Authentication" name="2fa")
      TwoFactorSetup
    
    el-tab-pane(label="Active Sessions" name="sessions")
      SessionManagement
    
    el-tab-pane(label="Password" name="password")
      el-card
        template(#header)
          h3 Change Password
        el-form(:model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-position="top")
          el-form-item(label="Current Password" prop="currentPassword")
            el-input(v-model="passwordForm.currentPassword" type="password" show-password)
          el-form-item(label="New Password" prop="newPassword")
            el-input(v-model="passwordForm.newPassword" type="password" show-password)
            .password-strength(v-if="passwordForm.newPassword")
              .strength-bar
                .strength-fill(:style="{ width: strengthWidth }" :class="strengthClass")
              span.strength-label {{ strengthLabel }}
          el-form-item(label="Confirm New Password" prop="confirmPassword")
            el-input(v-model="passwordForm.confirmPassword" type="password" show-password)
          el-form-item
            el-button(type="primary" @click="changePassword" :loading="loading") Change Password
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import TwoFactorSetup from '~/components/security/TwoFactorSetup.vue';
import SessionManagement from '~/components/security/SessionManagement.vue';
import { useApiFetch } from '~/composables/useApiFetch';

definePageMeta({
  layout: 'default'
});

const activeTab = ref('2fa');
const loading = ref(false);
const passwordFormRef = ref();

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordRules = {
  currentPassword: [
    { required: true, message: 'Please enter your current password', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: 'Please enter a new password', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: 'Please confirm your password', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.value.newPassword) {
          callback(new Error('Passwords do not match'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

const passwordStrength = computed(() => {
  const password = passwordForm.value.newPassword;
  if (!password) return 0;
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  return score;
});

const strengthWidth = computed(() => `${(passwordStrength.value / 6) * 100}%`);

const strengthClass = computed(() => {
  if (passwordStrength.value <= 2) return 'weak';
  if (passwordStrength.value <= 4) return 'medium';
  return 'strong';
});

const strengthLabel = computed(() => {
  if (passwordStrength.value <= 2) return 'Weak';
  if (passwordStrength.value <= 4) return 'Medium';
  return 'Strong';
});

async function changePassword() {
  try {
    await passwordFormRef.value?.validate();
    loading.value = true;
    
    await useApiFetch('auth/change-password', 'POST', {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword
    });
    
    ElMessage.success('Password changed successfully');
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to change password');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.security-settings {
  padding: 20px;
}

.security-settings h1 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #1f2937;
}

h3 {
  margin: 0;
}

.password-strength {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s, background 0.3s;
}

.strength-fill.weak { background: #ef4444; }
.strength-fill.medium { background: #f59e0b; }
.strength-fill.strong { background: #10b981; }

.strength-label {
  font-size: 12px;
  color: #6b7280;
}
</style>
