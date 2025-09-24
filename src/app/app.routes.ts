import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ContactComponent } from './contact/contact.component';
import { ServicesComponent } from './services/services.component';
import { AboutComponent } from './about/about.component';
import { OrderProductsComponent } from './order-products/order-products.component';
import { CustomerRegistrationComponent } from './customer-registration/customer-registration.component';
import { CustomerDashboardComponent } from './customer-dashboard/customer-dashboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'orders', component: OrderProductsComponent },
  { path: 'register', component: CustomerRegistrationComponent },
  { path: 'dashboard', component: CustomerDashboardComponent },
  { path: '**', redirectTo: '' }
];