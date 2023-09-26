import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../api.service';




@Component({

  selector: 'app-add-category',

  templateUrl: './add-category.component.html',

  styleUrls: ['./add-category.component.css']

})

export class AddCategoryComponent implements OnInit {




  categoryName: string | undefined;

  error: string | undefined;




  constructor(private apiService: ApiService, private router: Router) { }




  ngOnInit(): void {

  }




  onSubmit(): void {

    if (!this.categoryName) {

      this.error = 'Category name is required';

      return;

    }




    // Call the API service to add the category

    this.apiService.addCategory(this.categoryName).subscribe(

      () => {

        // Redirect to admin dashboard after successful category addition

        this.router.navigate(['/admin-dashboard']);

      },

      (error: any) => {

        console.error('Failed to add category:', error);

        this.error = 'Failed to add category';

      }

    );

  }




}