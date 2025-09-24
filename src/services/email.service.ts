import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  // private apiUrl = 'http://localhost:3003';
  private apiUrl = 'https://artesania-node-production.up.railway.app';

  constructor(private http: HttpClient) {}

  sendMail(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email`, data);
  }

  sendMailProduct(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-email-product`, data);
  }

}
