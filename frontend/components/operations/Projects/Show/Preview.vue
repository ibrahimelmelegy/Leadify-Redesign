<template lang="pug">
  .flex.justify-end.mx-16.mb-4
    el-button(
      size="large",
      type="primary",
      @click="exportToPDF",
      class="!bg-primary-purple-50 !text-primary-purple-500 !rounded-2xl"
    )
      Icon(name="IconExport", size="20")
      p.mx-1 Export
  .card.m-auto.bg-white.p-10.rounded-3xl.mb-3(class="w-[90%]", ref="contentToPrint")
    .grid.gap-4.grid-cols-1(class="md:grid-cols-3")
      div
        .text-neutral-400.font-medium.mb-2.flex.items-center
          Icon.mr-2(name="tabler:category-2", size="20")
          p Project Name
        p.text-neutral-800.mb-2 {{ project?.name || "-" }}
      div
        .text-neutral-400.font-medium.mb-2.flex.items-center
          Icon.mr-2(name="IconAssign", size="20")
          p Client
        p.text-neutral-800.mb-2 {{ project?.client?.clientName || "-" }}
      div
        .text-neutral-400.font-medium.mb-2.flex.items-center
          Icon.mr-2(name="IconCalendar", size="20")
          p Project Duration
        p.text-neutral-800.mb-2 {{ project?.duration || 0 }} Days
  .card.m-auto.bg-white.p-10.rounded-3xl.mb-24(class="w-[90%]")
    .title.font-bold.text-xl.capitalize.flex-1.mt-8 Final Costs Table
    .rounded-3xl.mt-3.border.mt-8
      AppTable(
        without-filters,
        without-search,
        without-action,
        without-pagination,
        :columns="manPowerPreview?.columns",
        :data="manPowerPreview?.data",
        class="!py-0"
      )
    .flex.justify-end.mt-12
      div
        p.text-lg.font-semibold.text-neutral-900.mb-3 Summary
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 GrandTotal :
          p.text-base.text-neutral-900 {{ formatNumber((project?.grandTotal || 0)?.toFixed(2)) }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Vat (15%) :
          p.text-base.text-neutral-900 {{ formatNumber((project?.vat || 0)?.toFixed(2)) }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-400 Discount :
          p.text-base.text-neutral-900 {{ formatNumber(Number(project?.discount) || 0) }} SAR
        .flex.justify-between.items-center.gap-12.mb-4.border-b.pb-4
          p.text-base.text-neutral-400 Margin ({{ Number(project?.marginPercentage) || 0 }}%) :
          p.text-base.text-neutral-900 {{ formatNumber((Number(project?.marginAmount) || 0)?.toFixed(2)) }} SAR
        .flex.justify-between.items-center.gap-12.mb-4
          p.text-base.text-neutral-900 Total Price :
          p.text-base.text-neutral-900 {{ formatNumber((Number(project?.totalCost) || 0)?.toFixed(2)) }} SAR
  </template>
  
  <script lang="ts" setup>
  import { defineProps, ref } from "vue";
  import jsPDF from "jspdf";
  import autoTable from "jspdf-autotable";
  
  const contentToPrint = ref(null);
  
  const props = defineProps({
    project: {
      type: Object,
      required: false,
    },
    manPowerPreview: {
      type: Object,
      required: false,
    },
  });
  
  
  async function exportToPDF() {
  try {
    // Helper function to check if we need a new page
    const checkNewPage = (doc: any, y: number, minSpace: number = 40) => {
      if (y > doc.internal.pageSize.height - minSpace) {
        doc.addPage();
        return 20; // Reset Y to top of new page with margin
      }
      return y;
    };
    const doc = new jsPDF();

    // Title (centered)
    doc.setFontSize(20);
    doc.setFont("", "bold");
    doc.text("Final Costs Project", 105, 20, { align: "center" });

    // Subtitle
    doc.setFontSize(12);
    doc.setFont("", "normal");
    doc.text(`Client: ${props.project?.client?.clientName || "-"}`, 105, 30, {
      align: "center",
    });

    // Project Info Section
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 31, 107);
    doc.text("Project Information", 12, 45);

    // Draw Table with Header Borders
    autoTable(doc, {
      startY: 50,
      body: [
        ["Project Name", props.project?.name || "-"],
        ["Project Start Date", getYear(props.project?.startDate)],
        ["Project End Date", getYear(props.project?.endDate)],
      ],
      columnStyles: {
        0: { cellWidth: 50, fillColor: [248, 247, 250] }, // Description Column Width
        1: { cellWidth: 130, fillColor: [255, 255, 255] },
      },
      styles: {
        lineWidth: 0.4, // Border thickness
        lineColor: [231, 230, 233], // Black border for header and columns
      },
    });

    // Table 1: Material Costs
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold"); // Gilroy is not a default font in jsPDF
    doc.setTextColor(50, 31, 107);
    doc.text("Total Material Cost", 12, doc.lastAutoTable.finalY + 20);

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25, // Position under title
      head: [["Description", "Quantity", "Unit Price (SAR)", "Total Cost"]],
      body: props.project?.materials.map((item: any) => [
        item?.description,
        item?.quantity,
        item?.unitPrice,
        item?.totalMaterialCost,
      ]),
      headStyles: {
        fillColor: [248, 247, 250], // Background color as rgba(231, 230, 233, 1)
        textColor: [101, 101, 101], // Ensuring text is visible
        fontStyle: "normal",
        fontSize: 12,
        font: "Gilroy", // Custom font (ensure it's registered in jsPDF)
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: {
        lineWidth: 0.4, // Border width set to 1px
        lineColor: [231, 230, 233], // Black border
      },
    });

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold"); // Gilroy is not a default font in jsPDF
    doc.setTextColor(50, 31, 107);
    doc.text("Total Manpower Cost", 12, doc.lastAutoTable.finalY + 20);

    // Table 2: Manpower Costs
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25, // Ensure it follows the previous table
      head: [["Name", "Estimated Work Days", "Duration Cost", "Total Cost"]],
      body: props.project?.projectManpowerResources.map((worker: any) => [
        worker?.manpower?.name,
        worker?.estimatedWorkDays,
        worker?.durationCost,
        worker?.totalCost,
      ]),
      headStyles: {
        fillColor: [248, 247, 250], // Background color as rgba(231, 230, 233, 1)
        textColor: [101, 101, 101], // Ensuring text is visible
        fontStyle: "normal",
        fontSize: 12,
        font: "Gilroy", // Custom font (ensure it's registered in jsPDF)
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: {
        lineWidth: 0.4, // Border width set to 1px
        lineColor: [231, 230, 233], // Black border
      },
    });

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold"); // Gilroy is not a default font in jsPDF
    doc.setTextColor(50, 31, 107);
    doc.text("Total Assets Cost", 12, doc.lastAutoTable.finalY + 20);
    // Table 3: Assets Costs
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25, // Ensures spacing between tables
      head: [["Name", "Buy Price (SAR)", "Rent Price (SAR)"]],
      body: props.project?.projectAssets.map((asset: any) => [
        asset?.asset?.name,
        asset?.buyPrice,
        asset?.rentPrice,
      ]),
      headStyles: {
        fillColor: [248, 247, 250], // Background color as rgba(231, 230, 233, 1)
        textColor: [101, 101, 101], // Ensuring text is visible
        fontStyle: "normal",
        fontSize: 12,
        font: "Gilroy", // Custom font (ensure it's registered in jsPDF)
      },
      bodyStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
      },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      styles: {
        lineWidth: 0.4, // Border width set to 1px
        lineColor: [231, 230, 233], // Black border
      },
    });
    //sumary card
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold"); // Gilroy is not a default font in jsPDF
    doc.setTextColor(50, 31, 107);
    doc.text("Total Costs", 12, doc.lastAutoTable.finalY + 20);
    const summaryCards = [
      {
        label: "Total Materials Cost",
        value: props.project?.totalMaterialCost || 0,
      },
      {
        label: "Total Manpower Cost",
        value: props.project?.manpowerTotalCost || 0,
      },
      {
        label: "Total Assets Cost",
        value: props.project?.totalAssetsCost || 0,
      },
      { label: "Total Car Rent", value: props.project?.totalCarRent || 0 },
      {
        label: "Total Car Rent Per Duration",
        value: props.project?.totalCarRentPerDuration || 0,
      },
      { label: "Total Costs", value: props.project?.grandTotal || 0 },
    ];

    // // Card layout settings
    const cardW = 85;
    const cardH = 35;
    const cardPadding = 5;
    const cardSpacingX = 12;
    const cardSpacingY = 8;
    const startX = 12;
    let x = startX;
    let yCards = doc.lastAutoTable.finalY + 25;
    let cardsPerRow = 2;

    summaryCards.forEach((card, idx) => {
      // Draw card border
       yCards = checkNewPage(doc, yCards);
      doc.setFillColor(248, 247, 250); // Set background color to rgba(248, 247, 250, 1)
      doc.rect(x, yCards, cardW, cardH, "F"); // Draw filled rectangle for background
      doc.setDrawColor(231, 230, 233);
      doc.setLineWidth(0.4);

      // Label (top, centered)
      doc.setTextColor(95, 90, 106);
      doc.setFontSize(14);
      doc.setFont("", "normal");
      doc.text(card.label, x + cardW / 2, yCards + 10, { align: "center" });
      doc.setFontSize(24);
      doc.setTextColor(63, 58, 77);
      doc.setFont("", "bold");
      doc.text(Number(card.value).toFixed(2), x + cardW / 2, yCards + 20, {
        align: "center",
      });

      // Currency (bottom, centered, gray)
      doc.setFontSize(14);
      doc.setFont("", "normal");
      doc.setTextColor(95, 90, 106);
      doc.text("SAR", x + cardW / 2, yCards + 30, { align: "center" });

      // Next card position
      if ((idx + 1) % cardsPerRow === 0) {
        x = startX;
        yCards += cardH + cardSpacingY;
      } else {
        x += cardW + cardSpacingX;
      }
    });

    //
    // Summary
    let summaryY = yCards + 10;
    summaryY = checkNewPage(doc, summaryY);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 31, 107);
    doc.text("Summary", 12, summaryY);

    // Draw Table with Header Borders
    autoTable(doc, {
      startY: summaryY + 5,
      body: [
        ["Project Name", props.project?.name || "-"],
        ["Report Date", `Report Date: ${getYear(new Date())}`],
        ["Grand Total", `${(props.project?.grandTotal || 0)?.toFixed(2)} SAR`],
        ["VAT (15%)", `${(props.project?.vat || 0)?.toFixed(2)} SAR`],
        ["Discount", `${props.project?.discount || 0} SAR`],
        [
          `Profit Margin (${props.project?.marginPercentage || 0}%)`,
          `${(props.project?.marginAmount || 0)?.toFixed(2)} SAR`,
        ],
        ["Final Price", `${(props.project?.totalCost || 0)?.toFixed(2)} SAR`],
      ],
      columnStyles: {
        0: { cellWidth: 50, fillColor: [248, 247, 250] }, // Description Column Width
        1: { cellWidth: 130, fillColor: [255, 255, 255] },
      },
      styles: {
        lineWidth: 0.4, // Border thickness
        lineColor: [231, 230, 233], // Black border for header and columns
      },
    });
    // Save the PDF
    doc.save(
      `${
        props.project?.name || "Project"
      } Project Report ${new Date().toLocaleDateString()}.pdf`
    );
  } catch (error) {
    console.error("Error exporting PDF:", error);
  }
}
</script>
