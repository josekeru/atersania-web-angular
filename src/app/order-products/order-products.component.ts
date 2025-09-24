import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService, Product, NewProduct } from '../../services/products.service';
import { OrdersService, Order } from '../../services/orders.service';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-order-products',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModalComponent],
  templateUrl: './order-products.component.html',
  styleUrl: './order-products.component.scss'
})

export class OrderProductsComponent implements OnInit {

  // --- Modal ---
  showModalEditOrder = false;
  selectedOrder: Order | null = null;
  showProductModalAdd = false;
  showProductModalEdit = false;
  newProduct: NewProduct = { name: '', description: '', quantity: 0, counter: 0, image: '', price: 0, tempProcessing: '' };
  editProduct: Product = { id: 0, name: '', description: '', quantity: 0, counter: 0, image: '', price: 0, tempProcessing: '' };

  activeTab: 'orders' | 'products' = 'orders';
  newStatus: Order['status'] | null = null;
  products: Product[] = [];
  orders: Order[] = [];
  
  modalTitle = '';
  modalMessage = '';
  showModal = false;
  modalClosed = false;

  constructor(private router: Router, private productService: ProductsService, private ordersService: OrdersService, private emailService: EmailService) {
    // Recuperar password
    const savedPassword = sessionStorage.getItem("password");
    console.log(savedPassword);
  
    if (savedPassword !== null && savedPassword === 'yes') {
    } else {
    const value = prompt('Introduce un valor:');
      if (value !== null && value === 'casaconpiscina14.') {
        sessionStorage.setItem("password", 'yes');
        this.modalTitle = 'Login exitoso';
        this.modalMessage = 'Contraseña correcta, bienvenida.';
        this.showModal = true;
        this.modalClosed = false;
      } else {
        this.router.navigate(['']);
      }
    }
  }
    
  ngOnInit(): void {
    this.updateTableOrders();
    this.updateTableProducts();
  }

  changeTab(tab: 'orders' | 'products') {
    this.activeTab = tab;
    if (tab === 'products') {
      this.updateTableProducts();
    } else if (tab === 'orders') {
      this.updateTableOrders();
    }
  }

  increment(product: Product, type: string) {
    if (type === 'decre' && product.counter > 0) {
      product.counter--;
    } else if (type === 'incre' && product.counter >= 0) {
      product.counter++;
    }
  }

  // MODAL AÑADIR PRODUCTO -------------------------------------------------------------------------------------------
  openAddNewProductModal() {
    this.showProductModalAdd = true;
    this.newProduct = { name: '', description: '', quantity: 0, counter: 0, image: '', price: 0, tempProcessing: '' };
  } 

  saveProducts() {
    this.newProduct.image = 'assets/images/' + this.newProduct.image + '.png';
    this.newProduct.counter = this.newProduct.quantity;
    this.productService.createProduct(this.newProduct).subscribe({
      next: (data) => {
        if (data.res) {
          this.modalTitle = 'Información';
          this.modalMessage = data.message;
          this.showModal = true;
          this.modalClosed = false;
          this.updateTableProducts();
          this.closeAddProductModal();
        }
      },
      error: (err) => console.error("Error actualizando producto:", err)
    });
  }

  closeAddProductModal() {
    this.showProductModalAdd = false;
  }
  // --------------------------------------------------------------------------------------------------------------------

  // MODAL EDITAR PRODUCTO -------------------------------------------------------------------------------------------
  openEditProductModal(product: Product) {
    this.editProduct = { ...product }; // clonar para no modificar directo
    this.showProductModalEdit = true;
  }

  saveEditProducts() {
    this.productService.updateProduct(this.editProduct.id, this.editProduct).subscribe({
      next: (data) => {
        if (data.res) {
          this.modalTitle = 'Información';
          this.modalMessage = data.message;
          this.showModal = true;
          this.modalClosed = false;
          this.updateTableProducts();
          this.closeEditProductModal();
        }
      },
      error: (err) => console.error("Error actualizando producto:", err)
    });
  }

  saveQuantityProduct(product: Product) {
    product.quantity = product.counter;
      this.productService.updateProduct(product.id, product).subscribe({
      next: (data) => {
        if (data.res) {
          this.modalTitle = 'Información';
          this.modalMessage = data.message;
          this.showModal = true;
          this.modalClosed = false;
          this.updateTableProducts();
        }
      },
      error: (err) => console.error("Error actualizando producto:", err)
    });
  }

  closeEditProductModal() {
    this.showProductModalEdit = false;
  }
  // --------------------------------------------------------------------------------------------------------------------

  // MODAL EDITAR ORDER -------------------------------------------------------------------------------------------
  openEditOrderModal(order: Order) {
    this.selectedOrder = { ...order }; // clonamos para no modificar directo
    this.showModalEditOrder = true;
  }

  editOrder() {
    const endDate = new Date();
    if (this.selectedOrder && this.newStatus) {
      this.selectedOrder.status = this.newStatus;
      this.selectedOrder.endDate = endDate.toISOString().split("T")[0];
      if (this.selectedOrder.createOrder) {
        this.selectedOrder.createOrder = this.selectedOrder.createOrder.split("T")[0];
      }
      if (this.selectedOrder.status === 'Produciendo') {
        const startDate = new Date();
        this.selectedOrder.startDate = startDate.toISOString().split("T")[0];
      } else {
        if (this.selectedOrder.startDate) {
          this.selectedOrder.startDate = this.selectedOrder.startDate.split("T")[0];
        }
      }
      this.ordersService.updateOrderById(this.selectedOrder.id, this.selectedOrder).subscribe((dataOrder) => {
        if (dataOrder.res) {
            this.sendEmailProduct(this.selectedOrder);
            this.modalTitle = 'Información';
            this.modalMessage = dataOrder.message;
            this.showModal = true;
            this.modalClosed = false;
            this.updateTableOrders();
            this.closeEditOrderModal();
          } else {
            this.modalTitle = '¡Alerta!';
            this.modalMessage = dataOrder.message;
            this.showModal = true;
            this.modalClosed = false;
          }
      });
    }
    if (this.selectedOrder) {
      const index = this.orders.findIndex(o => o.id === this.selectedOrder!.id);
      if (index !== -1) {
        this.orders[index] = { ...this.selectedOrder };
      }
    }
  }

  closeEditOrderModal() {
    this.showModalEditOrder = false;
    this.selectedOrder = null;
  }
  // --------------------------------------------------------------------------------------------------------------------


  selectStatus(status: Order['status']) {
    // if (this.selectedOrder) {
    //   this.selectedOrder.status = status;
    // }
    this.newStatus = status;
  }

  getStatusClass(status: Order['status']): string {
    switch (status) {
      case 'No pagado': return 'status-badge no-pagado';
      case 'Pagado': return 'status-badge pagado';
      case 'Produciendo': return 'status-badge produciendo';
      case 'Terminado': return 'status-badge terminado';
      case 'Enviado': return 'status-badge enviado';
      default: return '';
    }
  }

  updateTableProducts() {
    this.productService.getAllProduct().subscribe((data) => {
      if (data.message) {
        this.products = [];
      } else {
        this.products = data;
      }
    });
  }

  updateTableOrders() {
    this.ordersService.getAllOrder().subscribe((dataOrder) => {
      if (dataOrder.message) {
        this.orders = [];
      } else {
        this.orders = dataOrder;
        console.log('orders:', this.orders);
      }
    });
  }

  activeFilter: string = 'all'; // por defecto mostrar todo

  get filteredOrders(): Order[] {
    let filtered = this.orders;

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status?.toLowerCase() === this.activeFilter);
    }

    // ordenar por fecha (más antigua primero)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.startDate ?? '').getTime();
      const dateB = new Date(b.startDate ?? '').getTime();
      return dateA - dateB;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }
  
  onModalClosed() {
    this.modalClosed = true;
    this.showModal = false;
  }

  sendEmailProduct(selectedOrder: any) {
    const orderNumber = selectedOrder.orderNumber;
    let message = '';
    if (selectedOrder.status === 'Pagado') { 
      message = `<p>Hola <strong>${selectedOrder.userName}</strong>,</p><br/>
        <p>Información sobre su pedido número ${orderNumber}, ${selectedOrder.productName}.</p><br/>
        <hr />
        <p><strong>Su pago al pedido número ${orderNumber} y nombre ${selectedOrder.productName}, nos ha llegado y en breve procederemos a procesar y realizar su pedido.</strong>,</p><br/>
        <p>Si necesitas más información o modificación del pedido, porfavor mírelo en la web en la parte de pedidos, o pongase en contacto por WhatsApp al número 888888 con el número del pedido, y le atenderé lo antes posible.</p><br/>
        <p>Muchas gracias.</p>
        <p>Saludos, Merche</p>`;
    } else {
      message = `<p>Hola <strong>${selectedOrder.userName}</strong>,</p><br/>
        <p>Información sobre su pedido número ${orderNumber}, ${selectedOrder.productName}.</p><br/>
        <hr />
        <p><strong>Su pedido número ${orderNumber} y nombre ${selectedOrder.productName}, ha cambiado de estado y actualmente se encuentra en ${selectedOrder.status}.</strong></p><br/>
        <p>Si necesitas más información o modificación del pedido, porfavor mírelo en la web en la parte de pedidos, o pongase en contacto por WhatsApp al número 888888 con el número del pedido, y le atenderé lo antes posible.</p><br/>
        <p>Muchas gracias.</p><br/>
        <p>Saludos, Merche</p>`;
    }

    const data = {
      name: selectedOrder.userName,
      email: selectedOrder.email,
      message: message,
      phone: selectedOrder.phone,
    };
    this.emailService.sendMailProduct(data).subscribe({});
  }
}