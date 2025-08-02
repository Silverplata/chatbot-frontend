import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';

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
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('chatHistory');
    this.router.navigate(['/login']);
  }
}