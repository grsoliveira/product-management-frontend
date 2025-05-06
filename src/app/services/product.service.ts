import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  category: Category;
}

export interface Category {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductUrl = '/api/v1/product';
  private baseCategoryUrl = '/api/v1/category';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseProductUrl);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseCategoryUrl);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseProductUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseProductUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseProductUrl}/${id}`);
  }
}
