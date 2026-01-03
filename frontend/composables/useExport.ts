export function useExport() {
  
  async function exportToCSV(data: any[], filename: string, columns?: { key: string; label: string }[]) {
    if (!data.length) {
      throw new Error('No data to export');
    }

    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0]);
    const headers = columns ? columns.map(c => c.label) : keys;

    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        keys.map(key => {
          const value = row[key];
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  async function exportToExcel(data: any[], filename: string, columns?: { key: string; label: string }[]) {
    if (!data.length) {
      throw new Error('No data to export');
    }

    const keys = columns ? columns.map(c => c.key) : Object.keys(data[0]);
    const headers = columns ? columns.map(c => c.label) : keys;

    let tableHTML = '<table border="1">';
    tableHTML += '<thead><tr>';
    headers.forEach(header => {
      tableHTML += `<th style="background:#4472C4;color:white;padding:8px;">${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    tableHTML += '<tbody>';
    data.forEach((row, index) => {
      const bgColor = index % 2 === 0 ? '#ffffff' : '#f2f2f2';
      tableHTML += `<tr style="background:${bgColor}">`;
      keys.forEach(key => {
        const value = row[key] ?? '';
        tableHTML += `<td style="padding:6px;">${value}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';

    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.xls`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportToPDF(elementId: string, filename: string) {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    const styles = Array.from(document.styleSheets)
      .map(styleSheet => {
        try {
          return Array.from(styleSheet.cssRules)
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 20px; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  function downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob(['\ufeff' + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    exportToCSV,
    exportToExcel,
    exportToPDF,
  };
}
