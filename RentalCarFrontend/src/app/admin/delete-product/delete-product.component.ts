import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../api.service';




@Component({

  selector: 'app-delete-product',

  templateUrl: './delete-product.component.html',

  styleUrls: ['./delete-product.component.css']

})

export class DeleteProductComponent implements OnInit {

  productId: number | undefined;

  productDetails: any;




  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private apiService: ApiService

  ) { }




  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {

      this.productId = +idParam;

      // Call an API method to fetch the product details using the productId

      this.apiService.getProduct(this.productId).subscribe(

        (response) => {

          this.productDetails = response;

        },

        (error) => {

          console.log(error);

        }

      );

    } else {

      console.log('Invalid product ID');

      // Handle the case where the ID is missing or invalid

    }

  }

 




  deleteProduct(): void {
    console.log(this.productId);
    if (this.productId) {

      // Call the deleteProduct method from ApiService to delete the product

      this.apiService.deleteProduct(this.productId).subscribe(

        () => {

          console.log('Product deleted successfully');

          this.router.navigate(['/admin-dashboard']);

        },

        (error) => {

          console.log(error);

        }

      );

    } else {

      console.log('Invalid product ID');

      // Handle the case where the ID is missing or invalid

    }

  }

 




  cancel(): void {

    this.router.navigate(['/admin-dashboard']);

  }

}