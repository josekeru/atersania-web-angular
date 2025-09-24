import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @Input() showModal: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() login = new EventEmitter<{ email: string; password: string; res: string; }>();

  title = 'artesania-web';
  isLoggedIn = false;
  email = '';
  password = '';

  constructor(private router: Router, private usersService: UsersService) {}

  closeModal() {
    this.close.emit();
  }

  onLogin() {
    this.usersService.login(this.email, this.password).subscribe((data) => {
      if (data.user) {
        // alert('Usuario correcto');
        localStorage.setItem('userId', JSON.stringify(data.user.id));
        this.login.emit({
          email: this.email,
          password: this.password,
          res: 'ok',
        });
        this.closeModal();
      } else {
        alert(data.message);
      }
    });
  }
}
