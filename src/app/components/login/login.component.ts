import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { toast } from 'ngx-sonner';

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
          localStorage.setItem('access_token', response.access_token);
          toast.success('¡Inicio de sesión exitoso!');
          this.router.navigate(['/chat']);
        },
        error: (err) => {
          this.error.set('Usuario o contraseña incorrectos.');
          toast.error('Usuario o contraseña incorrectos.');
          console.error('Login error:', err);
        }
      });
    } else {
      this.error.set('Por favor, completa todos los campos.');
      toast.error('Por favor, completa todos los campos.');
    }
  }
}