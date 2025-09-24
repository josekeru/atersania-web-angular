import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { OrdersService, Order } from '../../services/orders.service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-dashboard.component.html',
  styleUrl: './customer-dashboard.component.scss'
})

export class CustomerDashboardComponent implements OnInit {

  customer: any;
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  customerName: string = '';
  
  statuses: string[] = ['All', 'No pagado', 'Pagado', 'Produciendo', 'Terminado', 'Enviado', 'Recibido'];
  currentFilter: string = 'All';

  constructor(private usersService: UsersService, private ordersService: OrdersService) { }

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    const getLocalUser: any = localStorage.getItem('userId');
    this.usersService.getUserSelect(parseInt(getLocalUser)).subscribe((data) => {
      this.customer = data;
      this.customerName = data.name;
      this.ordersService.getOrderByUserId(data.id).subscribe((dataOrder) => {
        if (dataOrder.message) {
          this.orders = [];
          this.filteredOrders = [];
        } else {
          this.orders = dataOrder;
          this.applyFilter();
        }
      });
    });
  }

  setFilter(status: string) {
    this.currentFilter = status;
    this.applyFilter();
  }

  applyFilter() {
    let list = [...this.orders];
    if (this.currentFilter !== 'All') {
      list = list.filter(order => order.status === this.currentFilter);
    }
    list.sort(
      (a, b) => new Date(a.startDate ?? 0).getTime() - new Date(b.startDate ?? 0).getTime()
    );
    this.filteredOrders = list;
  }
}
