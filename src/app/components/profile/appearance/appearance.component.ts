import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-appearance',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './appearance.component.html',
  styleUrls: ['./appearance.component.css']
})
export class AppearanceComponent implements OnInit {
  editAppearanceForm!: FormGroup; // Usamos ! para indicar que se inicializará en el constructor

  constructor(private fb: FormBuilder) {
    this.editAppearanceForm = this.fb.group({
      primaryColor: ['#4CAF50'],
      secondaryColor: ['#FFCA28'],
      accentColor: ['#2196F3'],
      backgroundColor: ['#E3F2FD']
    });
  }

  ngOnInit(): void {
    const savedPalette = JSON.parse(localStorage.getItem('colorPalette') || '{}');
    if (savedPalette) {
      this.editAppearanceForm.patchValue(savedPalette);
      this.setThemeColors(savedPalette);
    }
  }

  setThemeColors(palette: { primaryColor?: string; secondaryColor?: string; accentColor?: string; backgroundColor?: string }): void {
    const root = document.documentElement;
    if (palette.primaryColor) root.style.setProperty('--primary-color', palette.primaryColor);
    if (palette.secondaryColor) root.style.setProperty('--secondary-color', palette.secondaryColor);
    if (palette.accentColor) root.style.setProperty('--accent-color', palette.accentColor); // Corregido el typo 'acentColor'
    if (palette.backgroundColor) root.style.setProperty('--background-color', palette.backgroundColor);
  }

  onSubmit(): void {
    if (this.editAppearanceForm.invalid) {
      toast.error('Por favor, selecciona todos los colores.');
      return;
    }

    const palette = this.editAppearanceForm.value;
    localStorage.setItem('colorPalette', JSON.stringify(palette));
    this.setThemeColors(palette);
    toast.success('¡Tema actualizado con éxito!');
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
    localStorage.setItem('colorPalette', JSON.stringify(defaultColors));
    toast.success('Tema restablecido a los valores por defecto.');
  }
}