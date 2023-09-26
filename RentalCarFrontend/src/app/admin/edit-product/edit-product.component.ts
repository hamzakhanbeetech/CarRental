import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../api.service';




interface Product {

  carId: number;

  maker: string;

  model: string;

  rentalPrice: number;

  imageURL: string;

  availabilityStatus: Boolean;

  requestForReturn:Boolean;

}




@Component({

  selector: 'app-edit-product',

  templateUrl: './edit-product.component.html',

  styleUrls: ['./edit-product.component.css']

})

export class EditProductComponent implements OnInit {

  product: Product | undefined;
  availabilityS="";



  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private apiservice: ApiService

  ) {}




  ngOnInit() {

    const carIdParam = this.route.snapshot.paramMap.get('id');

    if (carIdParam !== null) {

      const carId = +carIdParam;

      if (!isNaN(carId)) {

        this.apiservice.getProduct(carId).subscribe(

          (product: Product) => {

            this.product = product;

          },

          (error) => {

            console.error(error);

          }

        );

      } else {

        console.error('Invalid product ID');

      }

    } else {

      console.error('Product ID is missing');

    }

  }

 

  updateProduct() {

    if (this.product) { 
      
      console.log(this.availabilityS);
      this.product.availabilityStatus = this.availabilityS === "true" ? true : false;
      console.log(this.product);
      this.apiservice.updateProduct(this.product.carId, this.product).subscribe(

        () => {

          this.router.navigate(['/admin-dashboard']);

        },

        (error: any) => {

          console.error(error);

        }

      );

    } else {

      console.error('Product is undefined');

    }

  }

 

}