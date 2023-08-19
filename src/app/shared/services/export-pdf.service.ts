import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autotable from 'jspdf-autotable'
@Injectable({
  providedIn: 'root'
})
export class ExportPDFService {

  constructor() { }

  imprimirHTML(pague: HTMLElement, nombreArchivo:string){
      
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "letter"
    })

    doc.setFontSize(1)
    doc.html(pague,{callback:(docpdf) => {

      const hoy = new Date();
      doc.save(nombreArchivo + hoy.getDate() + hoy.getMonth() + 
      hoy.getFullYear() + hoy.getTime() + '.pdf')


    }});

  }

  imprimir(encabezado: string[], cuerpo: any[], titulo: string, guardar?: boolean, nombreArchivo?:string) {

    nombreArchivo = nombreArchivo==undefined ? '' : nombreArchivo;
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "letter"
    })

    console.log(cuerpo)
    doc.text(titulo, doc.internal.pageSize.width / 2, 25, { align: 'center' });

    autotable(doc, { head: [encabezado], body: cuerpo })

    if (guardar) {
      const hoy = new Date();
      doc.save(nombreArchivo + hoy.getDate() + hoy.getMonth() + 
      hoy.getFullYear() + hoy.getTime() + '.pdf')
    }
  }
}
