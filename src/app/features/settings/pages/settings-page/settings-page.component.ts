import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss'
})
export class SettingsPageComponent {
  private fb = inject(FormBuilder);

  logoPreview = signal<string>('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200');
  saveSuccess = signal<boolean>(false);

  settingsForm: FormGroup = this.fb.group({
    storeName: ['Barone Imports', Validators.required],
    email: ['contato@baroneimports.com.br', [Validators.required, Validators.email]],
    phone: ['(11) 98765-4321', Validators.required],
    address: ['Av. Paulista, 1000 - Bela Vista, São Paulo - SP', Validators.required]
  });

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoPreview.set(e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  onSubmit(): void {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      return;
    }
    
    // Simulate setting updates saving
    this.saveSuccess.set(true);
    setTimeout(() => {
      this.saveSuccess.set(false);
    }, 3000);
  }
}
