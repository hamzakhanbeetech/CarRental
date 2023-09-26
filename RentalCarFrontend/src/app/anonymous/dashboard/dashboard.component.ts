import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../api.service';




@Component({

  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']

})

export class DashboardComponent implements OnInit {
  


  filterargs: any = {maker:''}

  categories: any[] = [];

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


  constructor(private router: Router, private apiService: ApiService) {}




  ngOnInit(): void {

    this.fetchProducts();
    this.fetchCategories();


  }


  fetchProducts(): void {

    this.apiService.getProducts().subscribe(

      (response: any) => {

        this.products = response;

        console.log('Products:', this.products);

        this.applyFilter();

      },

      (error: any) => {

        console.error('Error:', error);

      }

    );

  }


  fetchCategories(): void {

    this.apiService.getCategories().subscribe(

      (response: any) => {

        this.categories = response;

        console.log('Categories:', this.categories);

        this.applyFilter();

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

  goTo(param:any){   
    var userData = localStorage.getItem("userData") 
    if(!userData){
      this.router.navigate(['/sign/in']);
      return
    }
    this.router.navigate(['/product-description', param]);
  }

}