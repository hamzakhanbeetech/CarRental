import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../api.service';

import { ToastrService } from 'ngx-toastr';




@Component({

  selector: 'app-my-cart',

  templateUrl: './my-cart.component.html',

  styleUrls: ['./my-cart.component.css']

})

export class MyCartComponent implements OnInit {

  cartId: number | undefined;

  cartItems: any[] = [];

  selectedProducts: any[] = [];

  userId: number | undefined;

  product: any;




  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private apiService: ApiService,

    private toastr: ToastrService,

  ) { }




  ngOnInit(): void {

    // Get the cartId from the URL (you may need to adjust how you retrieve it)

    this.route.paramMap.subscribe(params => {

      const cartIdParam = params.get('cartId');

      const userIdParam = params.get('userId');

      if (cartIdParam != null && userIdParam != null) {

        this.cartId = +cartIdParam;

        this.userId = +userIdParam;

        this.getCartItems();

      } else {

        console.error('cartId is missing in the route parameters.');

      }

    });

  }




  getCartItems(): void {

  if (typeof this.cartId === 'number') {

    console.log('cartId:', this.cartId);

    this.apiService.getCartItems(this.cartId).subscribe(

      (response: any[]) => {

        this.cartItems = response;




        // Initialize name property for each cart product

        for (const cartProduct of this.cartItems) {

          cartProduct.name = ''; // Initialize the name property

          const productId = cartProduct.productId;

          this.getProduct(productId);

        }




        console.log('Cart Products:', this.cartItems);

      },

      (error: any) => {

        console.error('Error fetching cart products:', error);

      }

    );

  }

}




 

  getProduct(productId: number): void {

    this.apiService.getProduct(productId).subscribe(

      (response: any) => {

        const productIndex = this.cartItems.findIndex(cp => cp.productId === productId);

        if (productIndex !== -1) {

          this.cartItems[productIndex].name = response.name;

          this.cartItems[productIndex].price=response.price;

          this.cartItems[productIndex].availableQuantity=response.availableQuantity;

          console.log('Updated Cart Products:', this.cartItems); // Added console log

        }

      },

      (error: any) => {

        console.error('Error fetching product:', error);

      }

    );

  }

 

 




  increaseQuantity(cartProduct: any): void {

    // Check if quantity is within the available quantity limits

    // if (cartProduct.quantity < cartProduct.availableQuantity) {

        cartProduct.quantity++;

    // }

  }




  decreaseQuantity(cartProduct: any): void {

    // Check if quantity is greater than 1

    if (cartProduct.quantity > 1) {

      cartProduct.quantity--;
    }

  }




  removeProduct(cartItemId: number): void {

    this.apiService.removeProduct(cartItemId).subscribe(

      (response: any) => {

        // Remove the product from the cartProducts array

        this.cartItems = this.cartItems.filter(cp => cp.cartItemId !== cartItemId);

      },

      (error: any) => {

        console.error('Error removing product from cart:', error);

      }

    );

  }




  updateSelectedProducts(): void {

    this.selectedProducts = this.cartItems.filter(cp => cp.selected);

  }




  placeOrder(): void {

    if (typeof this.userId !== 'number') {

      return; // Exit if userId is not valid

    }

 

    const totalQuantity = this.selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

    const totalAmount = this.selectedProducts.reduce((sum, product) => sum + (product.quantity * product.price), 0);

 

    this.apiService.createOrder(this.userId, totalAmount, totalQuantity).subscribe(

      (orderResponse: any) => {

        const orderId = orderResponse.orderId;

 

        for (const selectedProduct of this.selectedProducts) {

          const productId = selectedProduct.productId;

          const quantity = selectedProduct.quantity;

 

          this.apiService.addOrderItem(orderId, productId, quantity).subscribe(

            (response: any) => {

              // Order product added successfully

              console.log('Order product added:', response);

            },

            (error: any) => {

              console.error('Error adding order product:', error);

            }

          );

        }

        this.toastr.success('Your car has been rented!', 'Successful', {

          positionClass: 'toast-top-right',

          timeOut: 2000,

          progressBar: true,

          closeButton: true,

          tapToDismiss: true,

          disableTimeOut: false,

          toastClass: 'notification-styles' 

        });

        //  this.router.navigate(['user/my-orders',this.userId]);

 

        // Remove selected products from cartProducts array

        this.cartItems = this.cartItems.filter(cp => !cp.selected);

        this.selectedProducts = [];

      },

      (error: any) => {

        console.error('Error creating order:', error);

        this.toastr.error('Error placing order. Please try again later.', 'Order Error', {

          positionClass: 'toast-top-right',

          timeOut: 2000,

          progressBar: true,

          closeButton: true,

          tapToDismiss: true,

          disableTimeOut: false,

          toastClass: 'notification-styles' // Apply custom CSS class to the toastr notification

        });

      }

    );

  }

}