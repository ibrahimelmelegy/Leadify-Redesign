import { PDFDocument } from 'pdf-lib';

export const generatePdf = async (proposalData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const { width, height } = page.getSize();

  // Add proposal details (title, reference, date, etc.)
  page.drawText(proposalData.title, { x: 50, y: height - 100 });

  // Add Table of Contents and content sections
  proposalData.content.forEach((item, index) => {
    page.drawText(`${index + 1}. ${item.title}`, { x: 50, y: height - 150 - index * 20 });
  });

  // Save the PDF and trigger download
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
