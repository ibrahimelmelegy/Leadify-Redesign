import { defineStore } from 'pinia';

export const useProposalStoreee = defineStore('proposalll', {
  state: () => ({
    proposalInfo: {},
    proposalContent: [],
  }),
  actions: {
    setProposalInfo(info) {
      console.log('>>>>>>>>>>>>>> useProposalStore', info);
      this.proposalInfo = info;
      console.log('>>>>>>>>>>>>>> useProposalStore', this.proposalInfo);
      navigateTo('/sales/proposals/proposal-content');
    },
    addContent(content) {
      this.proposalContent.push(content);
    },
    resetProposal() {
      this.proposalInfo = {};
      this.proposalContent = [];
    },
  },
});
