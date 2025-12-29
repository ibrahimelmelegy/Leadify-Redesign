import { defineStore } from 'pinia';

export const useProposalStore = defineStore('proposal', {
  state: () => ({
    proposalInfo: {
      relatedTo: '',
      clientName: '',
      proposaltitle: '',
      version: '1.0',
      date: new Date().toLocaleDateString(),
      proposalType: '',
      reference: '',
      proposalFor: '',
      assignUser: '',
      companyLogo: null,
      comments: '',
      fileAttachments: [],
    },
    proposalContent: {
      title: '',
      subtitle: '',
      description: '',
      financeTable: [],
    },
    grandTotal: 0,
    margin: 0,
    discount: 0,
    customColumns: [],
    status: 'Draft',
  }),

  actions: {
    // Add logic to handle table updates, margin, and discount calculations
    addFinanceItem(item) {
      this.proposalContent.financeTable.push(item);
      this.calculateGrandTotal();
    },
    calculateGrandTotal() {
      this.grandTotal = this.proposalContent.financeTable.reduce((total, item) => {
        return total + item.qty * item.unitPrice;
      }, 0);

      // Apply VAT, Margin, and Discount
      this.grandTotalWithAdjustments();
    },
    addMargin(marginPercentage) {
      this.margin = marginPercentage;
      this.grandTotalWithAdjustments();
    },
    addDiscount(discountAmount) {
      this.discount = discountAmount;
      this.grandTotalWithAdjustments();
    },
    grandTotalWithAdjustments() {
      let total = this.grandTotal;
      if (this.margin) {
        total += (this.margin / 100) * total;
      }
      if (this.discount) {
        total -= this.discount;
      }
      this.grandTotal = total;
    },
    setProposalInfo(data) {
      console.log('>>>>>>>>>>>>>> useProposalStoreInfo', data);
      this.proposalInfo = { ...this.proposalInfo, ...data };
    },
    setProposalContent(data) {
      this.proposalContent = { ...this.proposalContent, ...data };
    },
    finalizeProposal() {
      this.status = 'Waiting Approval';
    },
  },
});
