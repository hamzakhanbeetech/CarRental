import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ApiService } from '../../api.service';




export interface Review {

  reviewId: number;

  productId?: number;

  userId?: number;

  rating?: number;

  comment?: string;

  reviewDate?: Date;

}




export interface Product {

  carId: number;

  maker: string;

  model: string;

  rentalPrice?: number;

  

  imageURL?: string;

  

  availabilityStatus: Boolean;

}




@Component({

  selector: 'app-product-description',

  templateUrl: './product-description.component.html',

  styleUrls: ['./product-description.component.css']

})

export class ProductDescriptionComponent implements OnInit {

  productId: number = 0; // Assign a default value of 0 to productId

  product: Product | undefined; // Add | undefined to allow for undefined value

  reviews: Review[] = []; // Assign an empty array as default value




  constructor(

    private route: ActivatedRoute,

    private apiService: ApiService

  ) { }




  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (id) {

        this.productId = Number(id);

        console.log('id:', this.productId);

        this.getProductDetails();

        this.getReviewsByProductId();

      } else {

        // Handle the case when the productId is not present in the route

        console.log('productId is not available');

      }

    });

  }

 

  getProductDetails(): void {

    this.apiService.getProduct(this.productId)

      .subscribe(

        (product: Product) => {

          this.product = product;

        },

        (error: any) => {

          console.error('Failed to fetch product details:', error);

        }

      );

  }




  getReviewsByProductId(): void {

    this.apiService.getReviewsByProductId(this.productId)

      .subscribe(

        (reviews: Review[]) => {

          this.reviews = reviews;

        },

        (error: any) => {

          console.error('Failed to fetch reviews:', error);

        }

      );

  }

}