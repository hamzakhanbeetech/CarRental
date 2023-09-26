import { Component, OnInit } from '@angular/core';

import { ApiService } from '../../api.service';

import { ActivatedRoute, Router } from '@angular/router';




@Component({

  selector: 'app-my-orders',

  templateUrl: 'my-orders.component.html',

  styleUrls: ['my-orders.component.css']

})

export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  userId: number|undefined;

  isReturned: boolean = false;
 

  constructor(private apiService: ApiService,

    private route: ActivatedRoute,)

     {}




  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const userIdParam = params.get('userId');

      if (userIdParam != null) {

        this.userId = +userIdParam;

        this.getOrdersByUserId();

      } else {

        console.error('cartId is missing in the route parameters.');

      }

    });

  }




  getOrdersByUserId() {

    if(typeof this.userId==='number'){

    this.apiService.getOrdersByUserId(this.userId).subscribe(

      (response: any) => {

        this.orders = response;

        console.log("orders: ",this.orders);

        for (const order of this.orders) {

          this.getOrderProducts(order.orderId, order);

        }

      },

      (error: any) => {

        console.error('Error retrieving orders:', error);

      }

    );

    }

  }




  getOrderProducts(orderId: number,order:any) {

    this.apiService.getOrderItemByOrderId(orderId).subscribe(

      (response: any) => {

        console.log("OrderProducts: ",response);

        order.orderProducts = response;

        for (const orderProduct of order.orderProducts) {

          this.getProductDetails(orderProduct.productId, orderProduct);

        }

      },

      (error: any) => {

        console.error('Error retrieving order products:', error);

      }

    );

  }




  getProductDetails(productId: number, orderProduct: any) {

    this.apiService.getProduct(productId).subscribe(

      (response: any) => {

        console.log("products: ",response);

        orderProduct.product = response;

        orderProduct.product.imageUrl=response.imageUrl;

        orderProduct.product.name=response.name

        console.log("imageUrl : ",orderProduct.product.imageUrl);

        console.log("name: ",orderProduct.product.name);

      },

      (error: any) => {

        console.error('Error retrieving product details:', error);

      }

    );

  }

  returnCar(){
  
    this.isReturned = true;
  }

}

