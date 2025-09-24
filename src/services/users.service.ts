import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  // private apiUrl = 'http://localhost:3003';
  private apiUrl = 'https://artesania-node-production.up.railway.app';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  register(name: string, password: string, email: string, address: string, phone: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, { name, password, email, address, phone });
  }

  getUsersAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  getUserSelect(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getUserSelectDetail(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/userDetail/${id}`);
  }

  updateUser(id: number, name: string, password: string, email: string, address: string, phone: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, { name, password, email, address, phone });
  }

}
