import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  error = signal<string>('');

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.apiService.login(username, password).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/chat']);
        },
        error: () => {
          this.error.set('Usuario o contraseña incorrectos');
        }
      });
    }
  }
}