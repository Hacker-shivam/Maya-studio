import { jsPDF } from "jspdf";

export const generatePassportPDF = (imgData, count, sheetKey, photoSize) => {
  // Define sheet formats for jsPDF
  const sheetFormats = {
    A4: { w: 210, h: 297, format: 'a4' },
    "4x6": { w: 101.6, h: 152.4, format: [101.6, 152.4] },
    "5x7": { w: 127, h: 177.8, format: [127, 177.8] }
  };

  const sheet = sheetFormats[sheetKey];
  const doc = new jsPDF('p', 'mm', sheet.format);
  
  const margin = 10;
  const gutter = 2; // Gap between images
  let x = margin;
  let y = margin;

  for (let i = 0; i < count; i++) {
    // Check if next image fits in current row
    if (x + photoSize.width > sheet.w - margin) {
      x = margin;
      y += photoSize.height + gutter;
    }

    // Stop if we exceed the page height
    if (y + photoSize.height > sheet.h - margin) break;

    doc.addImage(imgData, 'JPEG', x, y, photoSize.width, photoSize.height);
    
    // Cutting guides (hairline)
    doc.setDrawColor(220);
    doc.setLineWidth(0.1);
    doc.rect(x, y, photoSize.width, photoSize.height);

    x += photoSize.width + gutter;
  }

  doc.save(`passport_${sheetKey}_layout.pdf`);
};