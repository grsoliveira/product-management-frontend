import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';
import { Category } from '../model/category.model';
import {ProductToList} from '../model/product-to-list.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductUrl = '/api/v1/product';
  private baseCategoryUrl = '/api/v1/category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProductToList[]> {
    return this.http.get<ProductToList[]>(this.baseProductUrl);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseCategoryUrl);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseProductUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.http.put(
      `${this.baseProductUrl}/${product.id}`,
      JSON.stringify(product),
      {
        observe: 'response',
        responseType: 'text',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseProductUrl}/${id}`, {
      observe: 'response',
      responseType: 'text'
    });
  }
}
