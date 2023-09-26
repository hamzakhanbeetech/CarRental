import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../api.service';




@Component({

  selector: 'app-add-review',

  templateUrl: 'add-review.component.html',

  styleUrls: ['add-review.component.css']

})

export class AddReviewComponent implements OnInit {

  productId: number | undefined;

  userId: number | undefined;

  rating: number | undefined;

  comment: string | undefined;

  reviewForm: FormGroup;




  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private formBuilder: FormBuilder,

    private apiService: ApiService

  ) {

    this.reviewForm = this.formBuilder.group({

      rating: [null, Validators.required],

      comment: ['', Validators.required]

    });

  }




  ngOnInit() {

    this.route.paramMap.subscribe(params => {

      const productIdParam = params.get('productId');

      const userIdParam = params.get('userId');

       

 

      if (productIdParam !== null && userIdParam !== null) {

        this.productId = +productIdParam;

        this.userId = +userIdParam;

       

      } else {

        console.error('ProductId or userId is missing in the route parameters.');

      }

    });

  }




  createReview() {

    console.log('Submit button clicked');

    console.log("productId: ", this.productId);

    console.log("userId: ", this.userId);

   

    // Assign values from form controls to variables

    this.rating = this.reviewForm.get('rating')?.value;

    this.comment = this.reviewForm.get('comment')?.value;

   

    console.log("rating: ", this.rating);

    console.log("comment: ", this.comment);

 

    if (!this.reviewForm || this.reviewForm.invalid) {

      console.error("Form is invalid");

      return;

    }

   

    // Check if the variables are defined and have valid values

    if (

      typeof this.userId !== 'undefined' &&

      typeof this.productId !== 'undefined' &&

      typeof this.rating !== 'undefined' &&

      typeof this.comment !== 'undefined'

    ) {

      {

        console.log('productId:', this.productId);

        console.log('userId:', this.userId);

        console.log('rating:', this.rating);

        console.log('comment:', this.comment);

      this.apiService.createReview(this.productId, this.userId, this.rating, this.comment)

        .subscribe(

          (response: any) => {

            // Handle successful submission

            console.log('Review created successfully:', response);

            // Redirect back to the product-description page

            this.router.navigate(['/user/product-description', this.productId,this.userId]);

          },

          (error: any) => {

            console.error('Error creating review:', error);

            // Handle error, e.g., display an error message to the user

          }

        );

    }

  }

  }

}