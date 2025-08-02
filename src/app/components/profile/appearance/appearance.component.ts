import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { toast } from 'ngx-sonner';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-appearance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appearance.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AppearanceComponent {
  paletteForm: FormGroup;
  userProfile = signal<any>(null);

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.paletteForm = this.fb.group({
      primary_color: ['#4CAF50', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      secondary_color: ['#FFCA28', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      accent_color: ['#E3F2FD', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]],
      background_color: ['#FFFFFF', [Validators.required, Validators.pattern(/^#[0-9A-Fa-f]{6}$/)]]
    });
    this.loadUserProfile();
  }

  private loadUserProfile() {
    const token = localStorage.getItem('access_token') || '';
    if (!token) {
      toast.error('Por favor, inicia sesión para acceder al perfil.');
      this.router.navigate(['/login']);
      return;
    }
    this.apiService.getUserProfile(token).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.paletteForm.patchValue({
          primary_color: profile.primary_color,
          secondary_color: profile.secondary_color,
          accent_color: profile.accent_color,
          background_color: profile.background_color
        });
        this.setThemeColors(profile);
        toast.success('Perfil cargado correctamente.');
      },
      error: (err) => {
        console.error('Profile error:', err);
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          toast.error('No se pudo cargar el perfil.');
          this.resetToDefault();
        }
      }
    });
  }

  private setThemeColors(palette: { primary_color?: string; secondary_color?: string; accent_color?: string; background_color?: string }) {
    const root = document.documentElement;
    if (palette.primary_color) root.style.setProperty('--primary-color', palette.primary_color);
    if (palette.secondary_color) root.style.setProperty('--secondary-color', palette.secondary_color);
    if (palette.accent_color) root.style.setProperty('--accent-color', palette.accent_color);
    if (palette.background_color) root.style.setProperty('--background-color', palette.background_color);
  }

  onSubmit() {
    if (this.paletteForm.invalid) {
      toast.error('Por favor, selecciona colores válidos.');
      return;
    }
    const token = localStorage.getItem('access_token') || '';
    if (!token) {
      toast.error('Por favor, inicia sesión para actualizar la paleta.');
      this.router.navigate(['/login']);
      return;
    }
    this.apiService.updateUserPalette(this.paletteForm.value, token).subscribe({
      next: () => {
        this.setThemeColors(this.paletteForm.value);
        toast.success('Paleta de colores actualizada.');
        this.loadUserProfile();
      },
      error: (err) => {
        console.error('Palette update error:', err);
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          toast.error('No se pudo actualizar la paleta de colores.');
        }
      }
    });
  }

  resetToDefault() {
    const defaultColors = {
      primary_color: '#4CAF50',
      secondary_color: '#FFCA28',
      accent_color: '#E3F2FD',
      background_color: '#FFFFFF'
    };
    this.paletteForm.patchValue(defaultColors);
    this.setThemeColors(defaultColors);
    const token = localStorage.getItem('access_token') || '';
    if (!token) {
      toast.error('Por favor, inicia sesión para restablecer la paleta.');
      this.router.navigate(['/login']);
      return;
    }
    this.apiService.updateUserPalette(defaultColors, token).subscribe({
      next: () => {
        toast.success('Paleta restablecida a los valores por defecto.');
        this.loadUserProfile();
      },
      error: (err) => {
        console.error('Reset palette error:', err);
        if (err.status === 401) {
          localStorage.removeItem('access_token');
          toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          this.router.navigate(['/login']);
        } else {
          toast.error('No se pudo restablecer la paleta de colores.');
        }
      }
    });
  }
}