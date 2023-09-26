import { Component } from '@angular/core';

import { Router } from '@angular/router';

import { ApiService } from '../../api.service';




interface User {

  userId: number;

  fullName: string;

  email: string;

  isAdmin: boolean;

  password: string;

  confirmPassword: string;

  categoryId: string;

}




@Component({

  selector: 'app-signin',

  templateUrl: './sign-in.component.html',

  styleUrls: ['./sign-in.component.css']

})

export class SignInComponent {

  email: string | undefined;

  password: string | undefined;

  error: string | undefined;




  constructor(private apiService: ApiService, private router: Router) {}




  onSubmit(): void {

    console.log('Sign In button clicked.');




    if (!this.email || !this.password) {

      console.log('Form is invalid.');

      return;

    }

    const login={
      username:this.email,
      password:this.password,
      rememberMe:true
    }
    console.log(login);

    this.apiService.validateUserLogin(login).subscribe(

      (user:any) => {

        console.log('user:', user);  
        
        localStorage.setItem("userData", JSON.stringify(user))

        // User login successful
        if (user != null) {

          // Fetch user details using the userId
          this.apiService.getUser(login.username).subscribe((userDetail: User) => {

              console.log('userDetail:', userDetail);
            },

            (error: any) => {

              // Error fetching user details
              console.error('Error fetching user details:', error);

            }

          );
          

              // Check if the user is an admin

              if (user.role === "Admin") {

                // Redirect to admin dashboard

                this.router.navigate(['/admin-dashboard']);

              } else {

                // Redirect to user dashboard

                this.router.navigate(['user-dashboard/'+user.role]);

              }

        } else {

          // User login failed

          this.error = 'Incorrect email or password';

        }

      },

      (error: any) => {

        // User login failed
        alert("Invalid Credentials")
        this.error = 'Incorrect email or password';

      }

    );

  }

}