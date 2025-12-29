<template>
  <div>
    <h2>Finalizing Proposal</h2>
    <button @click="generateProposalPDF">Generate PDF</button>
  </div>
</template>

<script setup>
  import { jsPDF } from "jspdf";
  import "jspdf-autotable";
  import { useProposalStore } from "~/stores/proposal";

  const store = useProposalStore();

  const generateProposalPDF = () => {
    const doc = new jsPDF();
    doc.text(`Proposal Title: ${store.proposalInfo.title}`, 10, 10);
    doc.text(`Proposal Date: ${new Date().toLocaleDateString()}`, 10, 20);

    doc.autoTable({
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: store.proposalContent.financeTable.map((item) => [
        item.description,
        item.qty,
        item.unitPrice,
        item.qty * item.unitPrice,
      ]),
    });

    doc.save("proposal.pdf");
  };
</script>
