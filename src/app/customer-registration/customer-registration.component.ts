import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-customer-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-registration.component.html',
  styleUrl: './customer-registration.component.scss'
})
export class CustomerRegistrationComponent {

  constructor(private fb: FormBuilder, private router: Router, private usersService: UsersService) {        
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  customerForm: FormGroup;

  navigate(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    if (this.customerForm.valid) {
      const customerData = this.customerForm.value;
      this.usersService.register(customerData.name, customerData.password, customerData.email, customerData.address, customerData.phone).subscribe(data => {
        if (data.res) {
          alert(data.message);
          localStorage.setItem('customer', JSON.stringify(customerData));
          localStorage.setItem('userId', data.user);
          this.router.navigate(['']);
        } else {
          alert(data.message);
        }
      })
    }
  }

}
