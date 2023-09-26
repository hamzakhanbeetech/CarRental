import { Component, NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

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

import { AdminDashboardComponent } from './admin/dashboard/dashboard.component';

import { UserDashboardComponent } from './signIn-user/dashboard/dashboard.component';

import { UserProductDescriptionComponent } from './signIn-user/product-description/product-description.component';

import { AddReviewComponent } from './add-review/add-review.component';
import { RentalAgreementComponent } from './anonymous/rental-aggrement/rental-aggrement.component';
import { MybookingComponent } from './anonymous/mybooking/mybooking.component';
import { RequestComponent } from './admin/request/request.component';



const routes: Routes = [

  {path: '', component: DashboardComponent },

  {path:'mybooking/:id',component:MybookingComponent},

  {path:'anonymous-dashboard', component: DashboardComponent},

  {path:'sign/up', component:SignUpComponent},

  {path:'admin-dashboard',component:AdminDashboardComponent},

  {path:'user-dashboard/:id',component:UserDashboardComponent},

  {path:'sign/in',component:SignInComponent},

  {path:'add-category', component:AddCategoryComponent},

  {path:'add-product',component:AddProductComponent},

  { path: 'edit-product/:id', component: EditProductComponent },

{ path: 'delete-product/:id', component: DeleteProductComponent },

{path:'product-description/:id',component:ProductDescriptionComponent},

{ path: 'user/product-description/:productId/:userId', component: UserProductDescriptionComponent },

{path:'user/my-cart/:cartId/:userId', component:MyCartComponent},

{path:'user/my-orders/:userId',component:MyOrdersComponent},

{path:'add-review/:productId/:userId',component:AddReviewComponent},
{path:'rental-aggrement/:id',component:RentalAgreementComponent},

{path:'AllReturnRequest',component:RequestComponent}

]




@NgModule({

  imports: [BrowserModule,

    FormsModule,

    RouterModule.forRoot(routes)

  ],

  exports: [RouterModule]

})

export class AppRoutingModule { }