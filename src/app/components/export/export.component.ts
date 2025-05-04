import jsPDF from 'jspdf';
import { Component } from '@angular/core';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css',
})
export class ExportComponent {
  handleExportPdf() {
    const canvas = document.querySelector('canvas');

    if (!canvas) return;

    // use jspdf
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    // get the canvas data url
    const data = canvas.toDataURL();

    // add the image to the pdf
    doc.addImage(data, 'PNG', 0, 0, canvas.width, canvas.height);

    // download the pdf
    doc.save('canvas.pdf');
  }
}
