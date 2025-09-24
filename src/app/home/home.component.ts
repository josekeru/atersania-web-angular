import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  
  showModal = false;

  constructor(private router: Router) {}
  
  navigate(path: string) {
    this.router.navigate([path]);
  }
  

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  handleLogin(credentials: { email: string; password: string, res: string }) {
    if (credentials.res === 'ok') {
      this.showModal = false;
      window.location.reload();
    }
  }
}
