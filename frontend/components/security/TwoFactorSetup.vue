<template lang="pug">
.two-factor-setup
  el-card
    template(#header)
      .card-header
        h3 Two-Factor Authentication
        el-tag(:type="enabled ? 'success' : 'info'") {{ enabled ? 'Enabled' : 'Disabled' }}
    
    .setup-content(v-if="!enabled")
      p.description
        | Add an extra layer of security to your account. You'll need to enter a code from your authenticator app when signing in.
      
      .setup-steps(v-if="setupMode")
        .step(v-if="step === 1")
          h4 Step 1: Scan QR Code
          p Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
          .qr-container
            img(:src="qrCode" alt="QR Code")
          .manual-code
            p Or enter this code manually:
            code {{ secret }}
          el-button(type="primary" @click="step = 2") Next
        
        .step(v-if="step === 2")
          h4 Step 2: Verify Code
          p Enter the 6-digit code from your authenticator app
          el-input(
            v-model="verificationCode"
            placeholder="000000"
            maxlength="6"
            style="width: 200px; text-align: center; font-size: 24px;"
          )
          .actions
            el-button(@click="cancelSetup") Cancel
            el-button(type="primary" :loading="loading" @click="verifyAndEnable") Enable 2FA
        
        .step(v-if="step === 3")
          h4 Backup Codes
          el-alert(type="warning" :closable="false")
            | Save these backup codes in a secure place. You can use them to access your account if you lose your phone.
          .backup-codes
            code(v-for="code in backupCodes" :key="code") {{ code }}
          el-button(type="primary" @click="completeSetup") Done
      
      el-button(v-else type="primary" @click="startSetup" :loading="loading") Set Up 2FA
    
    .enabled-content(v-else)
      p.success-message 2FA is enabled on your account.
      .actions
        el-button(@click="showBackupCodes = true") View Backup Codes
        el-button(type="danger" @click="showDisableDialog = true") Disable 2FA

  el-dialog(v-model="showDisableDialog" title="Disable 2FA" width="400px")
    el-form
      el-form-item(label="Password")
        el-input(v-model="disablePassword" type="password" placeholder="Enter your password")
      el-form-item(label="2FA Code")
        el-input(v-model="disableCode" placeholder="Enter 2FA code" maxlength="6")
    template(#footer)
      el-button(@click="showDisableDialog = false") Cancel
      el-button(type="danger" :loading="loading" @click="disable2FA") Disable
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApiFetch } from '~/composables/useApiFetch';
import { ElMessage } from 'element-plus';

const enabled = ref(false);
const setupMode = ref(false);
const step = ref(1);
const qrCode = ref('');
const secret = ref('');
const verificationCode = ref('');
const backupCodes = ref<string[]>([]);
const loading = ref(false);
const showDisableDialog = ref(false);
const showBackupCodes = ref(false);
const disablePassword = ref('');
const disableCode = ref('');

onMounted(async () => {
  await checkStatus();
});

async function checkStatus() {
  try {
    const response = await useApiFetch('2fa/status');
    enabled.value = response?.enabled || false;
  } catch (error) {
    console.error('Failed to check 2FA status:', error);
  }
}

async function startSetup() {
  try {
    loading.value = true;
    const response = await useApiFetch('2fa/setup', { method: 'POST' });
    qrCode.value = response.qrCode;
    secret.value = response.secret;
    setupMode.value = true;
    step.value = 1;
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to start 2FA setup');
  } finally {
    loading.value = false;
  }
}

async function verifyAndEnable() {
  if (verificationCode.value.length !== 6) {
    ElMessage.warning('Please enter a 6-digit code');
    return;
  }

  try {
    loading.value = true;
    const response = await useApiFetch('2fa/verify', {
      method: 'POST',
      body: { token: verificationCode.value }
    });
    backupCodes.value = response.backupCodes;
    step.value = 3;
    ElMessage.success('2FA enabled successfully!');
  } catch (error: any) {
    ElMessage.error(error.message || 'Invalid verification code');
  } finally {
    loading.value = false;
  }
}

function cancelSetup() {
  setupMode.value = false;
  step.value = 1;
  qrCode.value = '';
  secret.value = '';
  verificationCode.value = '';
}

function completeSetup() {
  setupMode.value = false;
  enabled.value = true;
  step.value = 1;
}

async function disable2FA() {
  try {
    loading.value = true;
    await useApiFetch('2fa/disable', {
      method: 'POST',
      body: {
        password: disablePassword.value,
        token: disableCode.value
      }
    });
    enabled.value = false;
    showDisableDialog.value = false;
    disablePassword.value = '';
    disableCode.value = '';
    ElMessage.success('2FA disabled');
  } catch (error: any) {
    ElMessage.error(error.message || 'Failed to disable 2FA');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.two-factor-setup {
  max-width: 600px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
}

.description {
  color: #6b7280;
  margin-bottom: 20px;
}

.qr-container {
  text-align: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  margin: 20px 0;
}

.qr-container img {
  max-width: 200px;
}

.manual-code {
  text-align: center;
  margin-top: 16px;
}

.manual-code code {
  display: block;
  font-size: 16px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  margin-top: 8px;
  letter-spacing: 2px;
}

.backup-codes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 20px 0;
}

.backup-codes code {
  display: block;
  padding: 10px;
  background: #f3f4f6;
  border-radius: 4px;
  text-align: center;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.success-message {
  color: #059669;
  font-weight: 500;
}

.step h4 {
  margin-top: 0;
}
</style>
