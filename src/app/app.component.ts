import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UsersService } from '../services/users.service';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'artesania-web';
  isLoggedIn = false;
  showModal = false;
  email = '';
  password = '';

  constructor(private router: Router, private usersService: UsersService) {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

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
      this.isLoggedIn = true;
      this.showModal = false;
    } else {
      this.isLoggedIn = false;
    }
  }
}
