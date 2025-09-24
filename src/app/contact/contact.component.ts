import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MessageModalComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {

  modalTitle = '';
  modalMessage = '';
  showModal = false;
  modalClosed = false;
  messageSendEmail = false;
  
  constructor(private http: HttpClient, private emailService: EmailService) {}

  sendEmail(e: Event) {
    this.messageSendEmail = true;
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = {
      name: (form as any).name.value,
      email: (form as any).email.value,
      message: (form as any).message.value,
      phone: (form as any).phone.value,
    };

    this.emailService.sendMail(data).subscribe({
      next: (data) => {
        this.modalTitle = 'Información';
        this.modalMessage = 'Correo enviado correctamente.';
        this.showModal = true;
        this.modalClosed = false;
        this.messageSendEmail = false;
      },
      error: (data) => {
        this.modalTitle = 'Alerta';
        this.modalMessage = 'Error al enviar el correo.';
        this.showModal = true;
        this.modalClosed = false;
        this.messageSendEmail = false;
      }
    });
  }
  
  onModalClosed() {
    this.modalClosed = true;
    this.showModal = false;
  }

}
