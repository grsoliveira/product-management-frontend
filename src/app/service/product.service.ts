import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {Product} from '../model/product.model';
import {Category} from '../model/category.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseProductUrl = '/api/v1/product';
  private baseCategoryUrl = '/api/v1/category';

  constructor(private http: HttpClient) {}

  loadAuthHeader(): HttpHeaders {
    const auth = sessionStorage.getItem('auth');
    return new HttpHeaders({
      'Authorization': `Basic ${auth}`
    });
  }

  getAll(): Observable<Product[]> {
    const headers = this.loadAuthHeader();
    // return this.http.get<Product[]>(this.baseProductUrl, { headers });
    return this.http.get<Product[]>(this.baseProductUrl);
  }

  getAllCategories(): Observable<Category[]> {
    const headers = this.loadAuthHeader();
    // return this.http.get<Category[]>(this.baseCategoryUrl, { headers });
    return this.http.get<Category[]>(this.baseCategoryUrl);
  }

  createProduct(product: Product): Observable<Product> {
    const headers = this.loadAuthHeader();
    // return this.http.post<Product>(this.baseProductUrl, product, { headers });
    return this.http.post<Product>(this.baseProductUrl, product);
  }

  updateProduct(product: Product): Observable<any> {
    const headers = this.loadAuthHeader();
    return this.http.put(
      `${this.baseProductUrl}/${product.id}`,
      JSON.stringify(product), // Garantir que o body está sendo serializado corretamente
      {
        observe: 'response',
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json' // Adicionar content-type explicitamente
        })
      }
    );
  }


  deleteProduct(id: number): Observable<any> {
    const headers = this.loadAuthHeader();
    return this.http.delete(`${this.baseProductUrl}/${id}`, {
      observe: 'response',
      responseType: 'text'
    });
  }
}
