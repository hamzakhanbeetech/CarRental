import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';




@Injectable({

  providedIn: 'root'

})

export class ApiService {

  private baseUrl = 'http://localhost:5030/api';




  constructor(private http: HttpClient) { }




  getCategories(): Observable<any> {

    const url = `${this.baseUrl}/categories`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  getProducts(): Observable<any> {

    

    return this.http.get('https://localhost:7196/api/Admin/all-cars').pipe(

      catchError(this.handleError)

    );

  }




  getProduct(productId: number): Observable<any> {

    const url = `${this.baseUrl}/products/${productId}`;

    return this.http.get('https://localhost:7196/api/Admin/GetCarDetail/'+productId).pipe(

      catchError(this.handleError)

    );

  }

  
  getOrdersByUserId(userId:number):Observable<any>

  {

    const url = `${this.baseUrl}/orders/user/${userId}`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  createReview( productId: number,userId: number, rating: number, comment: string): Observable<any> {

    const url = `${this.baseUrl}/reviews`;

    const params = { productId, userId, rating, comment };

 

    return this.http.post(url, null, { params }).pipe(

      catchError(this.handleError)

    );

  }

 

  getOrderItemByOrderId(orderId:number):Observable<any>

  {

    const url = `${this.baseUrl}/orderitems/order/${orderId}`;

   

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }




  signup(userData: any): Observable<any> {

    const url = `${this.baseUrl}/users`;

    return this.http.post('https://localhost:7196/api/Auth/Register', userData).pipe(

      catchError(this.handleError)

    );

  }




  validateUserLogin(login:any): Observable<any> {

    const url = `login`;

    




    return this.http.post('https://localhost:7196/api/Auth/Login',login).pipe(

      catchError(this.handleError)

    );

  }

  deleteProduct(productId: number): Observable<any> {

    const url = `${this.baseUrl}/products/${productId}`;

    return this.http.delete('https://localhost:7196/api/Admin/delete-car/'+productId).pipe(

      catchError(this.handleError)

    );

  }

  addCategory(categoryName: string): Observable<any> {

    const url = `${this.baseUrl}/categories`;

    const body = { name: categoryName };




    return this.http.post(url, body).pipe(

      catchError(this.handleError)

    );

  }

  addProduct(product: any): Observable<any> {

    const url = `${this.baseUrl}/products`;

    return this.http.post('https://localhost:7196/api/Admin/add-car', product).pipe(

      catchError(this.handleError)

    );

  }  

  GetBooking(id:number)
  {
    return this.http.get('https://localhost:7196/api/Admin/all-rental-agreements/'+id);
  }

  CheckAvailability(data:any)
  {
    return this.http.post('https://localhost:7196/api/Admin/CheckAvailability',data);
  }
  
  addBooking(product: any): Observable<any> {

    const url = `${this.baseUrl}/products`;

    return this.http.post('https://localhost:7196/api/Admin/AddRentalAgreement', product).pipe(

      catchError(this.handleError)

    );

  }

  updatingBooking(id:number,body:any)
  {
    return this.http.put('https://localhost:7196/api/Admin/update-rental-agreement/'+id,body);
  }
  updateProduct(productId: number, product: any): Observable<any> {

    const url = `${this.baseUrl}/products/${productId}`;

    return this.http.put('https://localhost:7196/api/Admin/update-car/'+productId, product).pipe(

      catchError(this.handleError)

    );

  }

 

  getReviewsByProductId(productId: number): Observable<any> {

    const url = `${this.baseUrl}/reviews/product/${productId}`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  getUser(userId: any): Observable<any> {

    const url = `${this.baseUrl}/users/${userId}`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }


  getAllRentalAgreement():Observable<any>
  {
    return this.http.get('https://localhost:7196/api/Admin/all-rental-agreements');
  }

  createCart(userId: number): Observable<any> {

    const url = `${this.baseUrl}/carts/${userId}`;

    const body = { userId };




    return this.http.post(url, body).pipe(

      catchError(this.handleError)

    );

  }




  addCartItem(cartId: number, productId: number, quantity: number): Observable<any> {

    const url = `${this.baseUrl}/cartitems`;

    const params = { cartId, productId,quantity };




    return this.http.post(url, null, { params }).pipe(

      catchError(this.handleError)

    );

  }

  getCartById(userId:number): Observable<any>

  {

    const url=`${this.baseUrl}/carts/user/${userId}`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  getcartitem(productId:number):Observable<any>

  {

    const url=`${this.baseUrl}/cartitems/product/${productId}`

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  getCartItems(cartId : number):Observable<any>{

    const url=`${this.baseUrl}/cartitems/cart/${cartId}`;

    return this.http.get(url).pipe(

      catchError(this.handleError)

    );

  }

  removeProduct(cartItemId:number): Observable<any>

  {

    const url = `${this.baseUrl}/cartitems/${cartItemId}`;

    return this.http.delete('https://localhost:7196/api/Admin/delete-car/'+cartItemId).pipe(

      catchError(this.handleError)

    );

  }

  createOrder(userId:number,amount:number, quantity: number):Observable<any>

  {

    const url = `${this.baseUrl}/orders`;

    const params = { userId,amount, quantity };




    return this.http.post(url, null, { params }).pipe(

      catchError(this.handleError)

    );

  }

  addOrderItem(orderId:number,productId:number,quantity:number):Observable<any>

  {

    const url = `${this.baseUrl}/orderitems`;

    const params = { orderId,productId,quantity };




    return this.http.post(url, null, { params }).pipe(

      catchError(this.handleError)

    );

  }

  private handleError(error: any) {

    if (error instanceof HttpErrorResponse) {

      console.error('Backend returned code ' + error.status + ', body was:', error.error);

      if (error.error && error.error.errors) {

        console.error('Validation errors:', error.error.errors);

      }

    } else {

      console.error('An error occurred:', error);

    }

    return throwError('Something went wrong. Please try again later.');

  }

}