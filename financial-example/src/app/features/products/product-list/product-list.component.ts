import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';
import { ProductsService } from 'src/app/core/services/products.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  products$: Observable<Product[]> = new Observable<Product[]>();
  searchTerm: string = '';
  itemsPerPage: number = 5;
  filteredProducts$: Observable<Product[]> = new Observable<Product[]>();
  totalProducts: any;

  constructor(private productsService: ProductsService,private modalService: ModalService, private router: Router) {}

  ngOnInit(): void {
    this.onlistProducts();
  }
  onlistProducts(){
    this.products$ = this.productsService.getProducts()
    .pipe(
      tap(products => {
        this.totalProducts = products.length; // Aquí almacenas el total de productos
      })
    );
    
  }

  onSearch(term: string) {
    this.searchTerm = term;
  }

  onItemsPerPageChange(value: number) {
    this.itemsPerPage = value;
  }
  onActionSelect(event: Event, product: Product): void {
    const action = (event.target as HTMLSelectElement).value;

    if (action === 'edit') {
      this.productsService.changeProduct(product);
      this.router.navigate(['add'], { queryParams: { id: product.id } });
    } else if (action === 'delete') {
      console.log('abre')
      this.modalService.openModal(product);
    }
  }


}
