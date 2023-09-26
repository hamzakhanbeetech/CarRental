import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from 'src/app/api.service';





@Component({

  selector: 'app-dashboard',

  templateUrl: './dashboard.component.html',

  styleUrls: ['./dashboard.component.css']

})

export class UserDashboardComponent {
  filterargs = {maker: ''};

  categories: any[] = [];

  products: any[] = [];

  filteredProducts: any[] = [];

  selectedCategory: string = 'all';

  selectedProduct: string = 'all';

  selectedPrice: string = 'all';

  searchQuery: string = '';

  sortColumn: string = '';

  sortDirection: string = 'asc';

  currentPage: number = 1;

  itemsPerPage: number = 2;

  totalPages: number[] = [];

  categoryId: number = 0;

  productId: number = 0;

  fullName: string = '';

  userId:number|undefined;

  cartId:number|undefined;




  constructor(private router: Router, private apiService: ApiService) {}




  ngOnInit(): void {

    this.fetchUserFullName();

    this.fetchCategories();

    this.fetchProducts();

    this.getCart();

  }

 


  goTo(param:any){   
    var userData = localStorage.getItem("userData") 
    if(!userData){
      this.router.navigate(['/sign/in']);
      return
    }
    this.router.navigate(['/product-description', param]);
  }



  fetchUserFullName(): void {

    const userIdString = this.router.url.split('/').pop();

console.log('Extracted user ID string:', userIdString);

 this.userId = parseInt(userIdString || '', 10);

console.log('Parsed user ID:', this.userId);




    this.apiService.getUser(this.userId).subscribe(

      (user: any) => {

        this.fullName = user.fullName; // Assign the full name to the component property

      },

      (error: any) => {

        console.error('Error fetching user details:', error);

      }

    );

  }

  getCart() {

    if (typeof this.userId === 'number') {

    this.apiService.getCartById(this.userId).subscribe(

      (response: any) => {

        this.cartId = response.cartId;

      },

      (error: any) => {

        console.error('Error creating cart: ', error);

      }

    );

  }

}




  fetchCategories(): void {

    this.apiService.getCategories().subscribe(

      (response: any) => {

        this.categories = response;

        // console.log('Categories:', this.categories);

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

        // console.log('Products:', this.products);

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

    console.log('totalPages: ',totalPages);

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

  goToCart() {

    this.router.navigate(['user/my-cart', this.cartId,this.userId]);

  }

  goToOrderPage(){

    this.router.navigate(['user/my-orders',this.userId]);

  }




  getSortIcon(column: string): string {

    if (this.sortColumn === column) {

      return this.sortDirection === 'asc' ? 'fa fa-sort-up' : 'fa fa-sort-down';

    }

    return '';

  }

  signOut(): void {
    localStorage.removeItem("userData")

    this.router.navigate(['/anonymous-dashboard']);

  }

}