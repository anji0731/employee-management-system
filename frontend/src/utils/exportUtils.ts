/**
 * Enterprise Data Table Export & Utility Helpers
 */

export const exportToCSV = (data: any[], filename = 'export.csv', columns?: { key: string; label: string }[]) => {
  if (!data || data.length === 0) return;

  const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  const headers = cols.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');

  const rows = data.map((item) =>
    cols
      .map((c) => {
        const val = item[c.key] ?? '';
        return `"${String(val).replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcelXML = (data: any[], filename = 'export.xls', columns?: { key: string; label: string }[]) => {
  if (!data || data.length === 0) return;

  const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  let xml = `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
  <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
   xmlns:o="urn:schemas-microsoft-com:office:office"
   xmlns:x="urn:schemas-microsoft-com:office:excel"
   xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
   <Worksheet ss:Name="Sheet1">
    <Table>`;

  xml += '<Row>';
  cols.forEach((c) => {
    xml += `<Cell><Data ss:Type="String">${c.label}</Data></Cell>`;
  });
  xml += '</Row>';

  data.forEach((item) => {
    xml += '<Row>';
    cols.forEach((c) => {
      const val = item[c.key] ?? '';
      xml += `<Cell><Data ss:Type="String">${String(val)}</Data></Cell>`;
    });
    xml += '</Row>';
  });

  xml += `</Table></Worksheet></Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const copyToClipboard = async (data: any[], columns?: { key: string; label: string }[]): Promise<boolean> => {
  if (!data || data.length === 0) return false;

  const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  const headers = cols.map((c) => c.label).join('\t');
  const rows = data.map((item) => cols.map((c) => item[c.key] ?? '').join('\t'));
  const text = [headers, ...rows].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    return false;
  }
};

export const printDataWindow = (title: string, data: any[], columns?: { key: string; label: string }[]) => {
  if (!data || data.length === 0) return;

  const cols = columns || Object.keys(data[0]).map((k) => ({ key: k, label: k }));
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  let html = `<html><head><title>${title}</title><style>
    body { font-family: sans-serif; padding: 20px; color: #1e293b; }
    h2 { margin-bottom: 15px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background-color: #f1f5f9; font-weight: bold; }
    tr:nth-child(even) { background-color: #f8fafc; }
  </style></head><body>`;

  html += `<h2>${title} Report</h2><table><thead><tr>`;
  cols.forEach((c) => {
    html += `<th>${c.label}</th>`;
  });
  html += `</tr></thead><tbody>`;

  data.forEach((item) => {
    html += `<tr>`;
    cols.forEach((c) => {
      html += `<td>${item[c.key] ?? ''}</td>`;
    });
    html += `</tr>`;
  });

  html += `</tbody></table></body></html>`;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

export const parseCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return resolve([]);
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length === 0) return resolve([]);

      const headers = lines[0].split(',').map((h) => h.replace(/^"(.*)"$/, '$1').trim());
      const results = [];

      for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(',').map((val) => val.replace(/^"(.*)"$/, '$1').trim());
        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentline[j] || '';
        }
        results.push(obj);
      }
      resolve(results);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};
