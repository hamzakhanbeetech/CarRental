import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../api.service';




interface Category {

  categoryId: number;

  name: string;

}




@Component({

  selector: 'app-add-product',

  templateUrl: './add-product.component.html',

  styleUrls: ['./add-product.component.css']

})

export class AddProductComponent {

  productName: string | undefined;

  description: string | undefined;

  quantity: number | undefined;

  imageUrl: string | undefined;

  rentalPrice: number | undefined;

  discount: number | undefined;

  categories: Category[] = [];

  selectedCategory: Category | null = null;




  constructor(private apiService: ApiService, private router: Router) {}




  ngOnInit(): void {

    this.apiService.getCategories().subscribe(

      (response: Category[]) => {

        this.categories = response;

      },

      (error: any) => {

        console.error('Failed to fetch categories:', error);

      }

    );

  }




  onSubmit(): void {


    const productData = {
      carId:10,

      maker: this.productName,

      model: this.description,

      rentalPrice: this.rentalPrice,

      imageURL: this.imageUrl,

      availabilityStatus:true,

      returnForRequest:false,

    };    

 



    console.log(productData);
    this.apiService.addProduct(productData).subscribe(

      (response: any) => {

        console.log('Product added successfully:', response);

        this.router.navigate(['/admin-dashboard']);

      },

      (error: any) => {

        console.error('Failed to add product:', error);

      }

    );

  }

}