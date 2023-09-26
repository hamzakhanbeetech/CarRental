import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  signupForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private apiService: ApiService) {
    this.signupForm = this.formBuilder.group({
      FullName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]+$')]],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      Password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[@$!%*?&])[a-zA-Z0-9@$!%*?&]{8,}$')
        ]
      ],
      ConfirmPassword: ['', Validators.required],
      IsAdmin: [false]
    }, { validators: this.passwordMatchValidator });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      // Handle invalid form
      console.log('Invalid form');
      return;
    }

    const userData = {
      fullName: this.signupForm.value.FullName,
      email: this.signupForm.value.Email,
      password: this.signupForm.value.Password,
      confirmPassword: this.signupForm.value.ConfirmPassword
    };

    console.log(userData);

    this.apiService.signup(userData).subscribe(
      (response) => {
        console.log('Sign-up successful:', response);
        // Redirect to the login page
        this.router.navigate(['sign/in']); // Fixed the navigation route
      },
      (error) => {
        console.error('Sign-up error:', error);
      }
    );
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('Password')?.value;
    const confirmPassword = formGroup.get('ConfirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('ConfirmPassword')?.setErrors({ passwordMismatch: true });
    } else {
      formGroup.get('ConfirmPassword')?.setErrors(null);
    }
  }
}
