import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/core/models/product.model';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(products: Product[] | null, searchTerm: string): Product[] {
    if (!products || !searchTerm) {
      return products || [];
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return products.filter(product =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }
}

