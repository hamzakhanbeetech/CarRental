import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../api.service';
import { Binary } from '@angular/compiler';




@Component({

  selector: 'app-product-description',

  templateUrl: './product-description.component.html',

  styleUrls: ['./product-description.component.css']

})

export class UserProductDescriptionComponent {

  productId: number | undefined;

  userId: number|undefined;

  product: any;

  reviews: any[] | undefined;

  cartId: number | undefined;

  quantity: number = 1;

  addedToCart: boolean = false;

  cartItemId:number|undefined;




  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private apiservice: ApiService,

   

  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const productIdParam = params.get('productId');

      const userIdParam = params.get('userId');

       

 

      if (productIdParam !== null && userIdParam !== null) {

        this.productId = +productIdParam;

        this.userId = +userIdParam;

        this.getProductDetails();

        this.getReviews();

       

        this.getCart();

      } else {

        console.error('ProductId or userId is missing in the route parameters.');

      }

    });

  }

 




  getProductDetails() {

    if (typeof this.productId === 'number') {

      this.apiservice.getProduct(this.productId).subscribe(

        (response: any) => {

          this.product = response;

        },

        (error: any) => {

          console.error('Error retrieving product details: ', error);

        }

      );

    } else {

      console.error('Invalid productId: ', this.productId);

    }

  }

 




  getReviews() {

    if (typeof this.productId === 'number') {

    this.apiservice.getReviewsByProductId(this.productId).subscribe(

      (response: any) => {

        this.reviews = response;

      },

      (error: any) => {

        console.error('Error retrieving reviews: ', error);

      }

    );

  }

}




  getCart() {

    if (typeof this.userId === 'number') {

    this.apiservice.getCartById(this.userId).subscribe(

      (response: any) => {

        this.cartId = response.cartId;

        if (typeof this.productId === 'number') {

          console.log(this.productId);

        this.apiservice.getcartitem(this.productId).subscribe(

          (response: any)=>{

            if(response==null)

            this.addProductToCart();

            else

            this.addedToCart=true;

          }

        );

        }

      },

      (error: any) => {

        console.error('Error creating cart: ', error);

      }

    );

  }

}




  addProductToCart() {

     if (typeof this.cartId === 'number'&& typeof this.productId ==='number'){

    this.apiservice.addCartItem(this.cartId, this.productId, this.quantity).subscribe(

      (response: any) => {

        this.cartItemId=response;

        console.log('Product added to cart successfully and cartproductid : ',response);

        this.addedToCart = true; // Set the flag to show "Go to Cart" button

      },

      (error: any) => {

        console.error('Error adding product to cart: ', error);

      }

    );

  }

}




  goToCart() {

    this.router.navigate(['user/my-cart', this.cartId,this.userId]);

  }




  goToCreateReview() {

    this.router.navigate(['add-review', this.productId,this.userId]);

  }

}