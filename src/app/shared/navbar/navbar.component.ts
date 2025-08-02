import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSonnerToaster, toast } from 'ngx-sonner';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgxSonnerToaster],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  router = inject(Router);

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token'); // Cambiado de 'token' a 'access_token'
  }

  logout() {
    localStorage.removeItem('access_token'); // Cambiado de 'token' a 'access_token'
    localStorage.removeItem('chatHistory');
    toast.success('¡Has cerrado sesión!');
    this.router.navigate(['/login']);
  }
}