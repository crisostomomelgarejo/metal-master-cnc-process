import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateHitoA = (formData, rates) => {
  const doc = new jsPDF();

  // Metal Master logo placeholder
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('METAL MASTER', 14, 20);

  // Order ID & Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`Order ID: ${formData.orderId || 'ORD-001'}`, 150, 15);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(14, 25, 196, 25);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Hito A: Planning & Estimation', 14, 35);

  // Tools Requested Section
  doc.setFontSize(12);
  doc.text('Tools Requested', 14, 45);
  const tools = formData.tools || [];
  const toolsData = tools.map((tool, index) => [
    index + 1,
    tool.name || 'N/A',
    tool.quantity || 0,
    tool.notes || ''
  ]);
  
  doc.autoTable({
    startY: 50,
    head: [['#', 'Tool Name', 'Quantity', 'Notes']],
    body: toolsData.length ? toolsData : [['-', 'No tools requested', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    styles: { fontSize: 10 }
  });

  // BOM/Inserts Section
  const bomY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('BOM / Inserts Required', 14, bomY);
  
  const boms = formData.boms || [];
  const bomData = boms.map((bom, index) => [
    index + 1,
    bom.partNumber || 'N/A',
    bom.description || '',
    bom.quantity || 0
  ]);

  doc.autoTable({
    startY: bomY + 5,
    head: [['#', 'Part Number', 'Description', 'Quantity']],
    body: bomData.length ? bomData : [['-', 'No BOM items', '-', '-']],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    styles: { fontSize: 10 }
  });

  // Material Purchase Status Section
  const matY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Material Purchase Status', 14, matY);
  
  doc.autoTable({
    startY: matY + 5,
    head: [['Material', 'Supplier', 'Status', 'Estimated Delivery']],
    body: [
      [
        formData.material || 'Standard Steel',
        formData.supplier || 'TBD',
        formData.materialStatus || 'Pending',
        formData.estimatedDelivery || 'TBD'
      ]
    ],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    styles: { fontSize: 10 }
  });

  // Estimated Cost Summary Section
  const costY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text('Estimated Cost Summary', 14, costY);

  // Calculate estimated cost based on rates
  let totalCost = 0;
  const costData = [];
  
  if (formData.estimatedHours && rates) {
    formData.estimatedHours.forEach(est => {
      const rateObj = rates.find(r => r.id === est.machineId || r.tipo_maquina === est.machineType);
      const rate = rateObj ? parseFloat(rateObj.precio_hora) : 0;
      const hours = parseFloat(est.hours) || 0;
      const cost = rate * hours;
      totalCost += cost;
      
      costData.push([
        est.machineType || 'Machine',
        `${hours} hrs`,
        `$${rate.toFixed(2)}/hr`,
        `$${cost.toFixed(2)}`
      ]);
    });
  }

  // Material cost
  const matCost = parseFloat(formData.materialCost) || 0;
  if (matCost > 0) {
    totalCost += matCost;
    costData.push(['Material Cost', '-', '-', `$${matCost.toFixed(2)}`]);
  }

  doc.autoTable({
    startY: costY + 5,
    head: [['Item / Machine', 'Est. Hours', 'Rate', 'Total']],
    body: costData.length ? costData : [['-', '-', '-', '-']],
    foot: [['', '', 'Total Estimated Cost:', `$${totalCost.toFixed(2)}`]],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
    styles: { fontSize: 10 }
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
    doc.text('Metal Master Internal Use Only', 14, 290);
  }

  doc.save(`Hito_A_${formData.orderId || 'ORD-001'}.pdf`);
};

export const generateReceiptOrder = (piece) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('METAL MASTER', 14, 20);

  doc.setFontSize(14);
  doc.text('Receipt Order', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Piece ID: ${piece.id || 'N/A'}`, 14, 40);
  doc.text(`Name: ${piece.nombre || 'N/A'}`, 14, 45);
  doc.text(`Status: ${piece.estado || 'N/A'}`, 14, 50);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 55, 196, 55);

  doc.text('General details regarding the reception of this piece.', 14, 65);

  doc.save(`Receipt_Order_${piece.id || 'Piece'}.pdf`);
};

export const generatePurchaseOrder = (piece) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('METAL MASTER', 14, 20);

  doc.setFontSize(14);
  doc.text('Purchase Order', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Piece ID: ${piece.id || 'N/A'}`, 14, 40);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

  doc.autoTable({
    startY: 50,
    head: [['Material / BOM', 'Quantity', 'Notes']],
    body: [
      [piece.material || 'Standard Material', '1', 'For piece fabrication']
    ],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
  });

  doc.save(`Purchase_Order_${piece.id || 'Piece'}.pdf`);
};

export const generateManufacturingOrder = (piece) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text('METAL MASTER', 14, 20);

  doc.setFontSize(14);
  doc.text('Manufacturing Decision & Details', 14, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Piece ID: ${piece.id || 'N/A'}`, 14, 40);
  doc.text(`Name: ${piece.nombre || 'N/A'}`, 14, 45);
  doc.text(`Complexity: ${piece.complejidad || 'N/A'}`, 14, 50);
  doc.text(`Estimated Time: ${piece.tiempo_estimado || 'N/A'} hrs`, 14, 55);
  
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);

  doc.autoTable({
    startY: 65,
    head: [['Operation', 'Time', 'Rate', 'Total Cost']],
    body: [
      ['Machining', piece.tiempo_estimado || '0', '$50/hr', `$${((piece.tiempo_estimado || 0) * 50).toFixed(2)}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [80, 80, 80] },
    foot: [['', '', 'Total:', `$${((piece.tiempo_estimado || 0) * 50).toFixed(2)}`]],
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
  });

  const finalY = doc.lastAutoTable.finalY || 100;
  
  doc.text('Approval Signatures:', 14, finalY + 20);
  doc.line(14, finalY + 30, 70, finalY + 30);
  doc.text('Manufacturing Manager', 14, finalY + 35);

  doc.line(100, finalY + 30, 156, finalY + 30);
  doc.text('Quality Control', 100, finalY + 35);

  doc.save(`Manufacturing_Order_${piece.id || 'Piece'}.pdf`);
};
