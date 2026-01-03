<template>
    <div>
      <h2>Proposal Info</h2>
      <form @submit.prevent="submitProposalInfo">
        <label for="proposalTitle">Proposal Title</label>
        <input type="text" id="proposalTitle" v-model="proposalInfo.title" required />
  
        <label for="proposalType">Proposal Type</label>
        <select v-model="proposalInfo.type" required>
          <option value="Financial">Financial</option>
          <option value="Technical">Technical</option>
          <option value="Mixed">Tech & Financial</option>
        </select>
  
        <label for="proposalReference">Proposal Reference</label>
        <input type="text" id="proposalReference" v-model="proposalInfo.reference" required />
  
        <label for="proposalFor">Proposal For</label>
        <input type="text" id="proposalFor" v-model="proposalInfo.for" required />
  
        <label for="assignedUser">Assigned User</label>
        <input type="text" id="assignedUser" v-model="proposalInfo.assignedUser" required />
  
        <button type="submit">Next</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useProposalStore } from '~/stores/proposal';
  
  const store = useProposalStore();
  const router = useRouter();
  const proposalInfo = ref({
    title: '',
    type: '',
    reference: '',
    for: '',
    assignedUser: '',
  });
  
  const submitProposalInfo = () => {
    store.setProposalInfo(proposalInfo.value);
    router.push('/sales/proposals/proposal-content');
  };
  </script>
  