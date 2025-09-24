import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id: number;
  description: string;
  counter: number;
  name: string;
  quantity: number;
  image: string;
  price: number;
  tempProcessing: string;
}

export interface NewProduct {
  description: string;
  counter: number;
  name: string;
  quantity: number;
  image: string;
  price: number;
  tempProcessing: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  // private apiUrl = 'http://localhost:3003';
  private apiUrl = 'https://artesania-node-production.up.railway.app';

  constructor(private http: HttpClient) {}

  getAllProduct(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products`);
    // return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/${id}`);
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(product: NewProduct): Observable<any> {
    return this.http.post(`${this.apiUrl}/products`, product);
    // return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/${id}`, product);
    // return this.http.put(`${this.apiUrl}/${id}`, product);
  }

}
