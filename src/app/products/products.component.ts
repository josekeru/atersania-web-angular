import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Services } from '../../services';
import { HttpClient } from '@angular/common/http';
import { ProductsService, Product } from '../../services/products.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';
import { UsersService } from '../../services/users.service';
import { MessageModalComponent } from '../message-modal/message-modal.component';
import { EmailService } from '../../services/email.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MessageModalComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  selectedProduct: Product | null = null;
  orderForm: FormGroup;
  numberLastOrder: number = 0;
  dataUser: { id: number, userName: string; address: string; email: string; phone?: string } | any = {};

  showModalWithoutUser: boolean = false;
  showModalEndProcess: boolean = false;
  selectUnits: number = 1;
  priceTotalSum: number = 0;  
  
  modalTitle = '';
  modalMessage = '';
  showModal = false;

   constructor(private fb: FormBuilder, private service: Services, private http: HttpClient, private productService: ProductsService, private orderService: OrdersService, private userService: UsersService, private emailService: EmailService) {
    this.orderForm = this.fb.group({
      userName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
}

  // llamar al back para guardar el pedido
  // en el back llamar o por aquí, llamar al telegram para enviar el mensaje
  // llamar al back para hacer get y actualizar la cantidad del producto
  ngOnInit(): void {
    this.getAllProducts();
    this.getLastOrder();
    this.getOrderByUserId();
  }

  getOrderByUserId() {
    const getLocalUser: any = localStorage.getItem('userId');
    if (getLocalUser) {
      this.userService.getUserSelectDetail(parseInt(getLocalUser)).subscribe((data) => {
        if (data.message) {
          this.dataUser = [];
        } else {
          this.dataUser = data;
        }
    });
    }
  }

  getAllProducts() {
    this.productService.getAllProduct().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error("Error cargando productos:", err)
    });
  }

  getLastOrder() {
    this.orderService.getLastOrder().subscribe({
      next: (data) => this.numberLastOrder = data[0]?.order_number || 0,
      error: (err) => console.error("Error cargando último pedido:", err)
    });
  }
  

  addProduct(product: Product) {
    const getLocalUser: any = localStorage.getItem('userId');
    if (!getLocalUser) {
      this.showModalWithoutUser = true;
      this.showModalEndProcess = false;
    } else {
      this.showModalWithoutUser = false;
      this.showModalEndProcess = true;
    }
    this.selectedProduct = product;
    this.priceTotalSum = product.price;
    // aquí luego lo conectas con tu lógica de pedidos

    // si no hay usuario logado, salir una modal formulario, donde se tendrá que rellenar un nombre, telefono, email y dirección.
    // en el objeto que se envíe, si no se ha añadido la info por modal, recoger la info del usuario y meterla en order.
    // hacer pedido back post(crearlo en node)

  }

  addOrderWithoutUser() {    
    this.showModalWithoutUser = false;
    this.showModalEndProcess = true;
  }

  async addOrder() {
  const getLocalUser: any = localStorage.getItem('userId');
  try {
    const data = await lastValueFrom(this.orderService.getLastOrder());
    this.numberLastOrder = data[0]?.order_number || 0;

    if (!getLocalUser) {
      await this.saveOrderEndWithoutUser();
    } else {
      await this.saveOrderEndWithUser();
    }

    await this.editQuantityProduct();
  } catch (err) {
    console.error("Error cargando último pedido:", err);
  }
}

  saveOrderEndWithoutUser() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      const startDate = new Date();
      const endDate = new Date();
      const createOrder = new Date();
      // endDate.setDate(startDate.getDate() + 5);
      const sendDataOrder = {
        userName: orderData.userName,
        orderNumber: parseInt(this.numberLastOrder.toString()) + 1,
        productName: this.selectedProduct?.name || '',
        status: 'No pagado',
        address: orderData.address,
        email: orderData.email,
        phone: orderData.phone,
        user_id: null,
        product_id: this.selectedProduct?.id || 0,
        startDate: startDate.toISOString().split("T")[0],
        endDate: null,
        createOrder: createOrder.toISOString().split("T")[0],
        units: this.selectUnits,
        totalPrice: this.priceTotalSum
      };
      this.sendDataToApi(sendDataOrder);
    }
  }

  saveOrderEndWithUser() {
      const startDate = new Date();
      const endDate = new Date();
      const createOrder = new Date();
      // endDate.setDate(startDate.getDate() + 5);
      const sendDataOrder = {
        userName: this.dataUser.name,
        orderNumber: parseInt(this.numberLastOrder.toString()) + 1,
        productName: this.selectedProduct?.name || '',
        status: 'No pagado',
        address: this.dataUser.address,
        email: this.dataUser.email,
        phone: this.dataUser.phone,
        user_id: this.dataUser.id,
        product_id: this.selectedProduct?.id || 0,
        startDate: startDate.toISOString().split("T")[0],
        endDate: null,
        createOrder: createOrder.toISOString().split("T")[0],
        units: this.selectUnits,
        totalPrice: this.priceTotalSum
      };      
      this.sendDataToApi(sendDataOrder);
  }

  sendDataToApi(sendDataOrder: any) {
    this.orderService.createOrder(sendDataOrder).subscribe(data => {
      if (data.res) {        
        this.modalTitle = '¡Alerta! Información';
        this.modalMessage =  `Gracias por realizar tu pedido.\n\nHemos recibido tu pedido y lo procesaremos lo antes posible, después de recibir el pago.\n\nPedido número ${sendDataOrder.orderNumber} creado correctamente.\n\n Deberás hacer el bizum al número 8888 con el número de pedido: ${sendDataOrder.orderNumber} para finalizar el pedido, y empezar a procesarlo.\n\nSi necesitas más información o modificación del pedido, porfavor mírelo en la web en la parte de pedidos, o pongase en contacto por WhatsApp al número 888888, y le atenderé lo antes posible.\n\nMuchas gracias.`;
        this.closeModal();
        this.sendEmailProduct();
        this.showModal = true;
      } else {
        this.closeModal();
        this.modalTitle = '¡Alerta!';
        this.modalMessage = data.message;
        this.showModal = true;
      }
    })
  }
  
  closeModal() {
    this.showModalWithoutUser = false;
    this.showModalEndProcess = false;
  }

  editQuantityProduct() {
    let product = this.selectedProduct;
    if (product) {
      product.counter = product.quantity;
      this.productService.updateProduct(product.id, product).subscribe({
        next: (data) => {
        },
        error: (err) => console.error("Error actualizando producto:", err)
      });
    }
  }

  increment(product: Product, type: string) {
    if (type === 'decre' && product.quantity > 0) {
      this.selectUnits--;
      product.quantity = product.quantity + 1;
    } else if (type === 'incre' && product.quantity > 0) {
      this.selectUnits++;
      product.quantity = product.quantity - 1;
    }
    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    this.priceTotalSum = this.selectUnits * (this.selectedProduct?.price || 0);
  }
  
  onModalClosed() {
    this.showModal = false;
  }

  sendEmailProduct() {
    const orderNumber = parseInt(this.numberLastOrder.toString()) + 1;
    const message = `<p>Hola <strong>${this.dataUser.name}</strong>,</p>
        <p><strong>Gracias por realizar el pedido.</strong></p>
        <p><strong>Hemos recibido su pedido y lo procesaremos lo antes posible, después de recibir el pago.</strong></p>
        <p>Pedido número <strong>${orderNumber}</strong>, creado correctamente.</p>
        <p><strong>Deberás hacer el bizum al número 8888 con el número de pedido: ${orderNumber} para poder finalizar con su pedido, y empezar a procesarlo.</strong></p>
        <p>Si necesitas más información o modificación del pedido, porfavor mírelo en la web en la parte de pedidos, o pongase en contacto por WhatsApp al número 888888, y le atenderé lo antes posible.</p>
        <p>Muchas gracias.</p>
        <p>Saludos, Merche</p>`;
    const data = {
      name: this.dataUser.name,
      email: this.dataUser.email,
      message: message,
      phone: this.dataUser.phone,
    };
    this.emailService.sendMailProduct(data).subscribe({});    
  }

}
