import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';

import { ApiService } from '../../api.service';
import { Product } from 'src/app/anonymous/product-description/product-description.component';


@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})



export class RequestComponent implements OnInit {
  startDate: Date = new Date(); 
  endDate: Date = new Date();
  categories: any[] = [];

  
  product:any[]=[];
  products: any[] = [];
  

  filteredProducts: any[] = [];

  selectedProduct: string = 'all';

  selectedCategory: string = 'all';

  selectedPrice: string = 'all';

  searchQuery: string = '';

  sortColumn: string = '';

  sortDirection: string = 'asc';

  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number[] = [];

  categoryId: number = 0;

  productId: number = 0;


  constructor(private router: Router, private apiService: ApiService,private route: ActivatedRoute,) {}




  ngOnInit(): void {

    
       

        this.fetchProducts();

       


  }
   


  


  fetchProducts(): void {

    this.apiService.getAllRentalAgreement().subscribe(

      (response: any) => {

        this.product=response;
        this.filteredProducts=response;
        console.log(this.filteredProducts);
        

      },

      (error: any) => {

        console.error('Error:', error);

      }

    );

  }


 


  




  applyFilter(): void {


    let filteredProducts = this.products;

    // Apply category filter

    if (this.selectedCategory !== 'all') {

      // console.log('Category Filter Applied');

      const selectedCategory = this.categories.find(

        (category: any) => category.name === this.selectedCategory

      );

      if (selectedCategory) {

        this.categoryId = selectedCategory.categoryId; // Use the correct property name for category ID

        console.log('categoryId:', this.categoryId);

        filteredProducts = filteredProducts.filter(

          (product: any) => product.categoryId === this.categoryId

        );
      }
    }

    this.filteredProducts = filteredProducts;

    this.calculateTotalPages();


    if (this.selectedProduct !== 'all') {

      const selectedProduct = this.filteredProducts.find(

        (product: any) => product.name === this.selectedProduct

      );

      if (selectedProduct) {

        this.productId = selectedProduct.productId; // Use the correct property name for product ID

        console.log('productId:', this.productId);

        filteredProducts = this.filteredProducts.filter(

          (product: any) => product.productId === this.productId

        );
      }
    }

    this.filteredProducts = filteredProducts;

    this.calculateTotalPages();


    if (this.selectedPrice !== 'all') {

      const selectedPrice = this.filteredProducts.find(

        (product: any) => product.price == this.selectedPrice

      );

      if (selectedPrice) {

        this.productId = selectedPrice.productId; // Use the correct property name for product ID

        console.log('productId:', this.productId);

        filteredProducts = this.filteredProducts.filter(

          (product: any) => product.productId === this.productId

        );
      }
    }

    this.filteredProducts = filteredProducts;

    this.calculateTotalPages();

    // Apply search query filter

    if (this.searchQuery.trim() !== '') {

      const searchTerm = this.searchQuery.toLowerCase();

      filteredProducts = filteredProducts.filter(

        (product: any) =>

          product.name.toLowerCase().includes(searchTerm) ||

          product.description.toLowerCase().includes(searchTerm)

      );

    }

    // Apply sorting

    if (this.sortColumn !== '') {

      filteredProducts.sort((a: any, b: any) => {

        const valA = a[this.sortColumn];

        const valB = b[this.sortColumn];

        return this.sortDirection === 'asc'

          ? valA.localeCompare(valB)

          : valB.localeCompare(valA);

      });

    }


    this.filteredProducts = filteredProducts;

    this.calculateTotalPages();

  }

  


  calculateTotalPages(): void {

    const totalItems = this.filteredProducts.length;

    this.totalPages = [];

    const totalPages = Math.ceil(totalItems / this.itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {

      this.totalPages.push(i);

    }

    if (this.currentPage > totalPages) {

      this.currentPage = 1;

    }

  }




  sortColumnClicked(column: string): void {

    if (this.sortColumn === column) {

      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';

    } else {

      this.sortColumn = column;

      this.sortDirection = 'asc';

    }

    this.applyFilter();

  }

  UpdatingBooking(updatingDetail:any): void {
    console.log("Hello:",this.product);
    const data = {
      rentalAgreementId: updatingDetail.rentalAgreementId,
      carId: updatingDetail.carId,
      userId: updatingDetail.userId,
      startDate:updatingDetail.startDate,
      endDate: updatingDetail.endDate,
      rentalDuration: updatingDetail.rentalDuration,
      totalCost: updatingDetail.rentalPrice, // Use the correct property name
      imageURL: updatingDetail.imageURL,
      model: updatingDetail.model,
      bookingRequest:true,
      bookingApprove:true
    };
    console.log(data);
    this.apiService.updatingBooking(updatingDetail.rentalAgreementId,data).subscribe(
      (response: any) => {
        alert('Booking is Confirm');
        console.log('Request is Approve successfully:', response);
        this.fetchProducts();
      },
      (error: any) => {
        console.error('Failed to Approve:', error);
      }
    );
  }

  goToPage(page: number): void {

    if (page >= 1 && page <= this.totalPages.length) {

      this.currentPage = page;

    }

  }




  getSortIcon(column: string): string {

    if (this.sortColumn === column) {

      return this.sortDirection === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';

    }

    return '';

  }

}