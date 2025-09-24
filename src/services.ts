import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Services {
  private botToken = '7912199974:AAHfHzrtG7t2BkilUE9oojveHSjjOAazDi0I';
  private chatId = '5940471'; // tu ID de Telegram
  private apiUrl = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
  // private apiUrl = `http://localhost:3003/send-message`;

  constructor(private http: HttpClient) {}

  sendOrder(producto: string, pedidoId: number) {
    const text = `Nuevo pedido 🛒\n\nPedido Nº: ${pedidoId}\nProducto: ${producto}`;
    // return this.http.post(this.apiUrl, {
    //   chat_id: this.chatId,
    //   text: text
    // });

    this.http
      .post(this.apiUrl, {
        message: 'Hola desde Angular!',
      })
      .subscribe({
        next: (res) => console.log('Mensaje enviado', res),
        error: (err) => console.error('Error', err),
      });
  }
}
