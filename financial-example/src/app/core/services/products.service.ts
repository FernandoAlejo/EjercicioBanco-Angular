import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products';

  constructor(private http:HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}`, {
           headers: { authorId: '1' },
         });
  }
  getProductById(id: string): Observable<Product> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.get<Product>(url, {
      headers: { authorId: '1' },
    });
  }
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product, {
      headers: { authorId: '1' },
    });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(this.baseUrl, product,  {
      headers: { authorId: '1' },
    });
  }

  deleteProduct(id: string): Observable<any> {
    const params = new HttpParams().set('id', id);
    return this.http.delete(this.baseUrl, { params ,headers: { authorId: '1' }}, );
  }

  verifyId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification?id=${id}`, {
      headers: { authorId: '1' },
    });
  }
  private _productSource = new BehaviorSubject<Product | null>(null);
  currentProduct = this._productSource.asObservable();

  changeProduct(product: Product | null) {
    this._productSource.next(product);
  }
}
