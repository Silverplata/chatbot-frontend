import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { Observable } from 'rxjs';

interface ColorPalette {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
}

interface User {
  username: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
}

@Component({
  selector: 'app-appearance',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.css']
})
export class AppearanceComponent implements OnInit {
  editAppearanceForm!: FormGroup;
  private apiUrl = 'http://localhost:8000';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.editAppearanceForm = this.fb.group({
      primaryColor: ['#4CAF50'],
      secondaryColor: ['#FFCA28'],
      accentColor: ['#2196F3'],
      backgroundColor: ['#E3F2FD']
    });
  }

  ngOnInit(): void {
    this.loadUserPalette();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  loadUserPalette(): void {
    this.http.get<User>(`${this.apiUrl}/user`, { headers: this.getAuthHeaders() })
      .subscribe({
        next: (user) => {
          const palette = {
            primaryColor: user.primary_color,
            secondaryColor: user.secondary_color,
            accentColor: user.accent_color,
            backgroundColor: user.background_color
          };
          this.editAppearanceForm.patchValue(palette);
          this.setThemeColors(palette);
        },
        error: (error) => {
          console.error('Error loading user palette:', error);
          toast.error('No se pudo cargar la paleta de colores.');
          this.resetToDefault();
        }
      });
  }

  setThemeColors(palette: { primaryColor?: string; secondaryColor?: string; accentColor?: string; backgroundColor?: string }): void {
    const root = document.documentElement;
    if (palette.primaryColor) root.style.setProperty('--primary-color', palette.primaryColor);
    if (palette.secondaryColor) root.style.setProperty('--secondary-color', palette.secondaryColor);
    if (palette.accentColor) root.style.setProperty('--accent-color', palette.accentColor);
    if (palette.backgroundColor) root.style.setProperty('--background-color', palette.backgroundColor);
  }

  onSubmit(): void {
    if (this.editAppearanceForm.invalid) {
      toast.error('Por favor, selecciona todos los colores.');
      return;
    }

    const palette: ColorPalette = {
      primary_color: this.editAppearanceForm.value.primaryColor,
      secondary_color: this.editAppearanceForm.value.secondaryColor,
      accent_color: this.editAppearanceForm.value.accentColor,
      background_color: this.editAppearanceForm.value.backgroundColor
    };

    this.http.put(`${this.apiUrl}/user/palette`, palette, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          this.setThemeColors(this.editAppearanceForm.value);
          toast.success('¡Tema actualizado con éxito!');
        },
        error: (error) => {
          console.error('Error updating palette:', error);
          toast.error('No se pudo actualizar la paleta de colores.');
        }
      });
  }

  resetToDefault(): void {
    const defaultColors = {
      primaryColor: '#4CAF50',
      secondaryColor: '#FFCA28',
      accentColor: '#2196F3',
      backgroundColor: '#E3F2FD'
    };

    this.editAppearanceForm.patchValue(defaultColors);
    this.setThemeColors(defaultColors);

    const defaultPalette: ColorPalette = {
      primary_color: defaultColors.primaryColor,
      secondary_color: defaultColors.secondaryColor,
      accent_color: defaultColors.accentColor,
      background_color: defaultColors.backgroundColor
    };

    this.http.put(`${this.apiUrl}/user/palette`, defaultPalette, { headers: this.getAuthHeaders() })
      .subscribe({
        next: () => {
          toast.success('Tema restablecido a los valores por defecto.');
        },
        error: (error) => {
          console.error('Error resetting palette:', error);
          toast.error('No se pudo restablecer la paleta de colores.');
        }
      });
  }
}