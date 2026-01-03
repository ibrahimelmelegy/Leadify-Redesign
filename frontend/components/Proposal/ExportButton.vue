<template>
  <button @click="exportProposal">Export as PDF</button>
</template>

<script setup>
import { generatePdf } from '~/utils/pdf-generator';

const exportProposal = async () => {
  const proposalData = {
    title: 'Sample Proposal',
    content: [
      { type: 'title', text: 'Introduction' },
      { type: 'subtitle', text: 'Proposal Overview' },
      { type: 'description', text: 'This is the description.' },
    ],
    financeDetails: [
      { description: 'Item 1', qty: 5, unitPrice: 10 },
      { description: 'Item 2', qty: 2, unitPrice: 15 },
    ],
  };

  const pdfData = await generatePdf(proposalData);
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'proposal.pdf';
  link.click();
};
</script>
