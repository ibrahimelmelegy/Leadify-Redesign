<template lang="pug">
.spotlight-wrapper
  //- Floating Trigger Button
  .spotlight-trigger(@click="openSpotlight" title="Open Command Palette (Alt+K)")
    Icon(name="ri:command-line" size="24")
  
  //- Overlay
  .spotlight-overlay(v-if="isOpen" @click.self="closeSpotlight")
    .spotlight-modal
      .spotlight-header
        Icon(name="ri:search-line" size="24" class="text-neutral-400")
        input(
          ref="searchInput"
          v-model="searchQuery"
          placeholder="Type a command or search..."
          @keydown.down.prevent="navigateDown"
          @keydown.up.prevent="navigateUp"
          @keydown.enter.prevent="executeAction"
          @keydown.esc="closeSpotlight"
        )
        .shortcut-hint
          span.key Esc
          span to close

      .spotlight-body(v-if="filteredActions.length")
        .action-group(v-for="(group, groupName) in groupedActions" :key="groupName")
          .group-title(v-if="group.length") {{ groupName }}
          .action-item(
            v-for="(action, index) in group"
            :key="action.id"
            :class="{ 'is-active': activeIndex === getGlobalIndex(action) }"
            @click="executeSpecificAction(action)"
            @mouseenter="activeIndex = getGlobalIndex(action)"
          )
            .action-icon
              Icon(:name="action.icon" size="20")
            .action-info
              .action-name {{ action.name }}
              .action-desc(v-if="action.description") {{ action.description }}
            .action-shortcut(v-if="action.shortcut")
              span.key {{ action.shortcut }}

      .spotlight-empty(v-else)
        Icon(name="bx:file-blank" size="48" class="text-neutral-500 mb-2")
        p No results found for "{{ searchQuery }}"

      .spotlight-footer
        .footer-item
          span.key Alt + K
          span to open
        .footer-item
          Icon(name="ri:arrow-up-down-line" size="14")
          span to navigate
        .footer-item
          Icon(name="ri:corner-down-left-line" size="14")
          span to select
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useMagicKeys, whenever, useDark, useToggle } from '@vueuse/core';
import { usePermissions } from '~/composables/usePermissions';
import { useMain } from "~/stores/common";

const router = useRouter();
const isDark = useDark();
const toggleDark = useToggle(isDark);

// --- Permissions Logic (Non-blocking) ---
const permissionsRef = ref<string[]>([]);
const isOpen = ref(false);

const hasPermission = (perm: string | null) => {
    if(!perm) return true;
    return permissionsRef.value.includes('all') || permissionsRef.value.includes(perm);
};

const clearPermissions = () => {
    permissionsRef.value = [];
};

onMounted(async () => {
    const mainStore = useMain();
    
    // 1. Try to load from store first (fastest)
    if (mainStore.permissions && mainStore.permissions.length > 0) {
         permissionsRef.value = mainStore.permissions;
    } else {
        // 2. Fetch if missing
        try {
            // Check if user is logged in before fetching permissions
            // We can check useMain store for user or check auth status
            const { user } = await useApiFetch("auth/me");
            if(user?.id) {
               const permData = await usePermissions();
               // Handle different return structures if necessary
               if (permData && permData.permissions) {
                    permissionsRef.value = permData.permissions.value || permData.permissions;
               }
            }
        } catch (e) {
            console.error("Failed to load permissions for spotlight", e);
        }
    }
});

const searchQuery = ref('');
const activeIndex = ref(0);
const searchInput = ref<HTMLInputElement | null>(null);

// --- Actions Data ---
const actions = [
  // --- Navigation: Sales ---
  { id: 'nav-dashboard', group: 'Sales', name: 'Dashboard', description: 'Go to Sales Dashboard', icon: 'ri:dashboard-line', handler: () => router.push('/'), permission: null },
  { id: 'nav-leads', group: 'Sales', name: 'Leads', description: 'Manage sales leads', icon: 'ri:user-star-line', handler: () => router.push('/sales/leads'), permission: 'READ_LEADS' },
  { id: 'nav-deals', group: 'Sales', name: 'Deals', description: 'View sales pipeline', icon: 'ri:shake-hands-line', handler: () => router.push('/sales/deals'), permission: 'READ_DEALS' },
  { id: 'nav-clients', group: 'Sales', name: 'Clients', description: 'Client database', icon: 'ri:user-follow-line', handler: () => router.push('/sales/clients'), permission: 'READ_CLIENTS' },
  { id: 'nav-proposals', group: 'Sales', name: 'Proposals', description: 'View and manage proposals', icon: 'ri:file-list-3-line', handler: () => router.push('/sales/proposals'), permission: 'READ_PROPOSALS' },

  // --- Navigation: Projects ---
  { id: 'nav-projects-list', group: 'Projects', name: 'All Projects', description: 'List of active projects', icon: 'ri:folder-3-line', handler: () => router.push('/operations/projects'), permission: 'READ_PROJECTS' },
  { id: 'nav-tasks', group: 'Projects', name: 'Tasks', description: 'My assigned tasks', icon: 'ri:task-line', handler: () => router.push('/operations/daily-task'), permission: 'READ_TASKS' },
  
  // --- Navigation: System ---
  { id: 'nav-settings', group: 'System', name: 'Settings', description: 'General settings', icon: 'ri:settings-3-line', handler: () => router.push('/settings'), permission: 'READ_SETTINGS' },
  { id: 'nav-security', group: 'System', name: 'Security', description: '2FA and Password', icon: 'ri:shield-key-line', handler: () => router.push('/settings/security'), permission: 'READ_SECURITY' },
  { id: 'nav-audit', group: 'System', name: 'Audit Logs', description: 'View system activity', icon: 'ri:file-history-line', handler: () => router.push('/audit-logs'), permission: 'READ_AUDIT_LOGS' },

  // --- Quick Actions: Create ---
  { id: 'act-new-lead', group: 'Create', name: 'New Lead', description: 'Add a new potential customer', icon: 'ri:user-add-line', handler: () => { router.push('/sales/leads?action=create'); closeSpotlight(); }, permission: 'CREATE_LEADS' },
  { id: 'act-new-deal', group: 'Create', name: 'New Deal', description: 'Start a new sales opportunity', icon: 'ri:shake-hands-line', handler: () => { router.push('/sales/deals?action=create'); closeSpotlight(); }, permission: 'CREATE_DEALS' },
  { id: 'act-new-client', group: 'Create', name: 'New Client', description: 'Register a new client', icon: 'ri:community-line', handler: () => { router.push('/sales/clients?action=create'); closeSpotlight(); }, permission: 'CREATE_CLIENTS' },
  { id: 'act-new-proposal', group: 'Create', name: 'New Proposal', description: 'Draft a new proposal', icon: 'ri:file-add-line', handler: () => { router.push('/sales/proposals?action=create'); closeSpotlight(); }, permission: 'CREATE_PROPOSALS' },
  
  { id: 'act-new-project', group: 'Create', name: 'New Project', description: 'Launch a new project', icon: 'ri:building-add-line', handler: () => { router.push('/operations/projects/add-project'); closeSpotlight(); }, permission: 'CREATE_PROJECTS' },
  { id: 'act-new-task', group: 'Create', name: 'New Task', description: 'Assign a daily task', icon: 'ri:task-add-line', handler: () => { router.push('/operations/daily-task?action=create'); closeSpotlight(); }, permission: 'CREATE_TASKS' },
  
  { id: 'act-new-staff', group: 'Create', name: 'New Staff Member', description: 'Onboard a new employee', icon: 'ri:user-follow-line', handler: () => { router.push('/staff?action=create'); closeSpotlight(); }, permission: 'CREATE_STAFF' },
  { id: 'act-new-role', group: 'Create', name: 'New Role', description: 'Define access permissions', icon: 'ri:shield-user-line', handler: () => { router.push('/roles?action=create'); closeSpotlight(); }, permission: 'CREATE_ROLES' },
  
  { id: 'act-new-asset', group: 'Create', name: 'New Asset', description: 'Register equipment/assets', icon: 'ri:archive-line', handler: () => { router.push('/operations/assets?action=create'); closeSpotlight(); }, permission: 'CREATE_ASSETS' },
  { id: 'act-new-vehicle', group: 'Create', name: 'New Vehicle', description: 'Add to fleet', icon: 'ri:steering-2-line', handler: () => { router.push('/operations/vehicle?action=create'); closeSpotlight(); }, permission: 'CREATE_VEHICLES' },

  // --- System Actions ---
  { id: 'act-theme', group: 'System', name: 'Toggle Theme', description: 'Switch Dark/Light mode', icon: 'ri:contrast-line', handler: () => toggleDark(), permission: null },
  { id: 'act-logout', group: 'System', name: 'Logout', description: 'Sign out', icon: 'ri:logout-box-line', handler: async () => {
      const response = await useApiFetch("auth/logout", "POST");
      if (response?.message === "Logged out successfully" || true) { 
         clearPermissions();
         const accessToken = useCookie("access_token");
         accessToken.value = "";
         if(typeof localStorage !== 'undefined') localStorage.removeItem("access_token");
         router.push("/login");
      }
  }, permission: null },
];

// --- Filtering ---
const filteredActions = computed(() => {
  let filtered = actions;

  // 1. Filter by Permissions
  filtered = filtered.filter(action => {
      if (!action.permission) return true; // Public action
      return hasPermission(action.permission);
  });

  // 2. Filter by Search Query
  if (!searchQuery.value) return filtered;
  const query = searchQuery.value.toLowerCase();
  return filtered.filter(action => 
    action.name.toLowerCase().includes(query) || 
    action.group.toLowerCase().includes(query) ||
    (action.description && action.description.toLowerCase().includes(query))
  );
});

const groupedActions = computed(() => {
  const groups: Record<string, typeof actions> = {};
  filteredActions.value.forEach(action => {
    if (!groups[action.group]) groups[action.group] = [];
    groups[action.group].push(action);
  });
  return groups;
});

// --- Logic ---
function openSpotlight() {
  isOpen.value = true;
  searchQuery.value = '';
  activeIndex.value = 0;
  nextTick(() => {
    searchInput.value?.focus();
  });
}

function closeSpotlight() {
  isOpen.value = false;
}

function getGlobalIndex(targetAction: any) {
  return filteredActions.value.findIndex(a => a.id === targetAction.id);
}

function navigateDown() {
  if (activeIndex.value < filteredActions.value.length - 1) {
    activeIndex.value++;
    scrollToActive();
  }
}

function navigateUp() {
  if (activeIndex.value > 0) {
    activeIndex.value--;
    scrollToActive();
  }
}

function scrollToActive() {
    const activeEl = document.querySelector('.action-item.is-active');
    activeEl?.scrollIntoView({ block: 'nearest' });
}

function executeAction() {
  const action = filteredActions.value[activeIndex.value];
  if (action) {
    executeSpecificAction(action);
  }
}

function executeSpecificAction(action: any) {
  action.handler();
  if (action.id !== 'act-theme') { 
      closeSpotlight();
  }
}

// --- Keyboard Shortcuts ---
const keys = useMagicKeys();

whenever(keys['Alt+K'], () => {
  openSpotlight();
});

whenever(keys.Escape, () => {
  closeSpotlight();
});

function handleKeydown(e: KeyboardEvent) {
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        openSpotlight();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});

watch(isOpen, (val) => {
    if(val) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});
</script>

<style scoped lang="scss">
/* Trigger Button */
.spotlight-trigger {
  position: fixed;
  bottom: 30px;
  right: 30px; /* Right aligned */
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6); /* Indigo to Purple */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  z-index: 9998; /* Below modal, above content */
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.spotlight-trigger:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.spotlight-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15vh;
  animation: fadeIn 0.2s ease-out;
}

.spotlight-modal {
  width: 100%;
  max-width: 600px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease-out;
}

.dark .spotlight-modal {
  background: #1e293b; /* Slate 800 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.spotlight-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
}

.dark .spotlight-header {
  border-bottom-color: rgba(255, 255, 255, 0.05);
}

.spotlight-header input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 18px;
  color: #1e293b;
  outline: none;
}

.dark .spotlight-header input {
  color: #f8fafc;
}

.spotlight-header input::placeholder {
  color: #94a3b8;
}

.shortcut-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.key {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: inherit;
  font-weight: 500;
  font-size: 11px;
}

.dark .key {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.1);
  color: #cbd5e1;
}

.spotlight-body {
  max-height: 400px;
  overflow-y: auto;
  padding: 12px;
}

.dark .spotlight-body::-webkit-scrollbar {
  width: 6px;
}
.dark .spotlight-body::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
}

.group-title {
  padding: 8px 12px 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.5px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.1s;
  color: #475569;
}

.dark .action-item {
  color: #cbd5e1;
}

.action-item:hover,
.action-item.is-active {
  background: #f1f5f9;
  color: #0f172a;
}

.dark .action-item:hover,
.dark .action-item.is-active {
  background: rgba(99, 102, 241, 0.15); /* Indigo Tint */
  color: #f8fafc;
  border-left: 3px solid #818cf8; /* Accent border */
  padding-left: 9px; /* Compensate for border */
}

.action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  width: 24px;
  min-width: 24px;
  height: 24px;
  overflow: hidden; /* Prevent text spill if icon fails */
}

.dark .action-item.is-active .action-icon {
  color: #818cf8;
}

.action-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.action-name {
  font-weight: 500;
  font-size: 14px;
}

.action-desc {
  font-size: 12px;
  opacity: 0.7;
  margin-top: 2px;
}

.spotlight-empty {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94a3b8;
}

.spotlight-footer {
  padding: 10px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #64748b;
}

.dark .spotlight-footer {
  background: rgba(15, 23, 42, 0.3);
  border-top-color: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
}

.footer-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
