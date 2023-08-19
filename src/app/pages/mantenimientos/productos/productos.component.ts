import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Productos } from 'src/app/shared/models/productos';
import { ProductosService } from 'src/app/shared/services/productos.service';
import { AdminProductosComponent } from './admin-productos/admin-productos.component';
import { ToastrService } from 'ngx-toastr';
import { ExportPDFService } from 'src/app/shared/services/export-pdf.service';

// const ELEMENT_DATA: Productos[] = [];

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
})
export class ProductosComponent {
  displayedColumns: string[] = [
    'id',
    'nombre',
    'categoria',
    'precio',
    'acciones',
  ];

  dataSource = new MatTableDataSource();

  constructor(
    private srvProductos: ProductosService,
    public dialog: MatDialog,
    private mensajeria: ToastrService,
    private srvExport: ExportPDFService
  ) {}
  ngOnInit() {
    this.cargarlista()
  }

  cargarlista(){
    this.srvProductos.getAll().subscribe(
      (datos) => {
        // console.log(datos);
        this.dataSource.data = datos;
      },
      (error) => {
        this.mensajeria.error(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  modificar(): void {
    alert('modificar');
  }

  eliminar(id: number): void {
    this.srvProductos.eliminar(id).subscribe(
      (dato) => {
        alert('Se eliminó el producto');
      },
      (err) => {
        alert('Error al eliminar');
      }
    );
  }

  detalle(dato: Productos): void {
    alert(dato.nombre);
  }

  abrirDialog(producto?: Productos): void {
    let dialogOpen;
    if (producto) {
      dialogOpen = this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
        data: { producto },
      });
    } else {
      dialogOpen = this.dialog.open(AdminProductosComponent, {
        width: '700px',
        height: '700px',
      });
    }

    dialogOpen.afterClosed().subscribe((data)=>{
      this.cargarlista();
    })
  }

  exportar(){
    const datos = this.dataSource.data.map((pro:any) => {
      const row= [
        pro.id,
        pro.nombre,
        pro.categoria.nombre,
        pro.precio
      ]
      return row;
    })
    // Mandar los productos
    this.srvExport.imprimir(this.displayedColumns, datos, 'Lista Productos', true, 'productos');
  }

  exportarHTML(){
    try {

      const page = document.querySelector('table') as HTMLElement;

      console.log(page)
      this.srvExport.imprimirHTML(page,'TablaProductos')

    } catch (error) {
      
    }
  }
}
