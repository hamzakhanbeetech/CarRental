import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../api.service';




@Component({

  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']

})

export class AdminDashboardComponent implements OnInit {
  filterargs = {maker: ''};

  adminName: string = 'Admin';

  categories: any[] = [];

  products: any[] = [];

  filteredProducts: any[] = [];

  selectedCategory: string = 'All Categories';

  searchQuery: string = '';

  sortColumn: string = '';

  sortDirection: string = 'asc';

  currentPage: number = 1;

  itemsPerPage: number = 10;

  totalPages: number[] = [];

  categoryId: number = 0;




  constructor(private router: Router, private apiService: ApiService) {}




  ngOnInit(): void {

    this.fetchCategories();

    this.fetchProducts();

  }




  fetchCategories(): void {

    this.apiService.getCategories().subscribe(

      (response: any) => {

        this.categories = response;

        console.log('Categories:', this.categories);

      },

      (error: any) => {

        console.error('Error:', error);

      }

    );

  }




  fetchProducts(): void {

    this.apiService.getProducts().subscribe(

      (response: any) => {

        this.products = response;

        console.log('products:', this.products);

        this.applyFilter();

      },

      (error: any) => {

        console.error('Error:', error);

      }

    );

  }




  applyFilter(): void {

    console.log('Selected Category:', this.selectedCategory);

    let filteredProducts = this.products;




    // Apply category filter

    if (this.selectedCategory !== 'All Categories') {

      console.log('Category Filter Applied');

      const selectedCategory = this.categories.find(

        (category: any) => category.name === this.selectedCategory

      );

      if (selectedCategory) {

        this.categoryId = selectedCategory.categoryId; // Use the correct property name for category ID

        console.log('categoryId:', this.categoryId);

        filteredProducts = filteredProducts.filter(

          (product: any) => product.categoryId === this.categoryId

        );

        console.log('Filtered Products:', filteredProducts);

      }

    }




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

  addProduct(): void {

    this.router.navigate(['/add-product']);

  }

  ReturnRequest()
  {
    this.router.navigate(['AllReturnRequest']);
  }



  addCategory(): void {

    this.router.navigate(['/add-category']);

  }




  signOut(): void {

    localStorage.removeItem("userData")

    this.router.navigate(['/anonymous-dashboard']);

  }

  editProduct(productId: number) {

    console.log('id:', productId);

    this.router.navigate(['edit-product', productId]);

  }

 

  deleteProduct(productId: number) {

    this.router.navigate(['delete-product', productId]);

  }

 

 

}