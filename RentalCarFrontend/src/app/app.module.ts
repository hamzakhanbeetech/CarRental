import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { NgxPaginationModule } from 'ngx-pagination';

import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './anonymous/dashboard/dashboard.component';

import { ProductDescriptionComponent } from './anonymous/product-description/product-description.component';

import { SignUpComponent } from './anonymous/sign-up/sign-up.component';

import { SignInComponent } from './anonymous/sign-in/sign-in.component';

import { MyCartComponent } from './signIn-user/my-cart/my-cart.component';

import { MyOrdersComponent } from './signIn-user/my-orders/my-orders.component';

import { AddCategoryComponent } from './admin/add-category/add-category.component';

import { AddProductComponent } from './admin/add-product/add-product.component';

import { EditProductComponent } from './admin/edit-product/edit-product.component';

import { DeleteProductComponent } from './admin/delete-product/delete-product.component';

import { ApiService } from './api.service';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';

import { UserDashboardComponent } from './signIn-user/dashboard/dashboard.component';

import { UserProductDescriptionComponent } from './signIn-user/product-description/product-description.component';

import { AddReviewComponent } from './add-review/add-review.component';

import { ToastrModule, ToastrConfig } from 'ngx-toastr';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RentalAgreementComponent } from './anonymous/rental-aggrement/rental-aggrement.component';
import { MybookingComponent } from './anonymous/mybooking/mybooking.component';
import { RequestComponent } from './admin/request/request.component';
import { MyFilterPipe } from './pipes/filter.pipe';

import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';


import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';



@NgModule({

  declarations: [

    AppComponent,

    DashboardComponent,

    ProductDescriptionComponent,

    SignUpComponent,

    SignInComponent,

    MyCartComponent,

    MyOrdersComponent,

    AddCategoryComponent,

    AddProductComponent,

    EditProductComponent,

    DeleteProductComponent,

    AdminDashboardComponent,

    UserDashboardComponent
    ,UserProductDescriptionComponent, 
    AddReviewComponent,
    RentalAgreementComponent,
    MybookingComponent,
    RequestComponent,
    MyFilterPipe,

  ],

  imports: [
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,

    BrowserModule,

    BrowserAnimationsModule,

    FormsModule,

    HttpClientModule,

    NgxPaginationModule,

    RouterModule,

    AppRoutingModule,

    ReactiveFormsModule,

    ToastrModule.forRoot({}),

    NoopAnimationsModule,

    BrowserAnimationsModule,
     NgbModule,

  ],

  providers: [ApiService],

  bootstrap: [AppComponent]

})

export class AppModule { }