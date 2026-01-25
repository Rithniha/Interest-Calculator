import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (data, title = 'Report') => {
    const doc = jsPDF();
    doc.text(title, 20, 10);

    const tableColumn = ["Name", "Role", "Outstanding Balance"];
    const tableRows = [];

    data.forEach(item => {
        const rowData = [
            item.name,
            item.role,
            `₹ ${item.outstandingBalance.toLocaleString()}`
        ];
        tableRows.push(rowData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.save(`${title}.pdf`);
};

export const exportToExcel = (data, fileName = 'Report') => {
    const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
        Name: item.name,
        Role: item.role,
        Balance: item.outstandingBalance
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
