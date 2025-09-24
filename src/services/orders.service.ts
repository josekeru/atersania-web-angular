import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Order {
  id: number;
  description: string;
  userName: string;
  orderNumber: string;
  productName: string;
  status: string;
  address: string;
  email: string;
  phone?: string;
  units?: number;
  totalPrice?: number;
  endDate?: string;
  startDate?: string;
  deliveryTime?: string;
  price?: number;
  createOrder?: string;
}

export interface AddOrder {
  userName: string;
  orderNumber: number;
  productName: string;
  status: string;
  address: string;
  email: string;
  phone?: number;
  user_id: number | null;
  product_id: number;
  units?: number;
  totalPrice?: number;
  endDate?: string;
  startDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  // private apiUrl = 'http://localhost:3003';
  private apiUrl = 'https://artesania-node-production.up.railway.app';

  constructor(private http: HttpClient) {}

  getOrderByUserId(id: number): Observable<any> {
    // id de usuario
    return this.http.get(`${this.apiUrl}/orders/${id}`);
    // return this.http.get<Product[]>(this.apiUrl);
  }

  getOrderById(id: number): Observable<any> {
    // id de order
    return this.http.get(`${this.apiUrl}/order/${id}`);
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getAllOrder(): Observable<any> {
    // id de order
    return this.http.get(`${this.apiUrl}/orders`);
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  getLastOrder(): Observable<any> {
    // id de order
    return this.http.get(`${this.apiUrl}/last-orders`);
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  updateOrderById(id: number, order: Order): Observable<any> {
    // id de order
    return this.http.put(`${this.apiUrl}/order/${id}`, order);
    // return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  createOrder(order: AddOrder): Observable<any> {
    return this.http.post(`${this.apiUrl}/order`, order);
    // return this.http.post<Product>(this.apiUrl, product);
  }

}
