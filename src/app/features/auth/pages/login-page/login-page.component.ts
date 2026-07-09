import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // States
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Form definition
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: () => {
        // Retrieve return URL from route parameters or default to '/' (which redirects to /noticias)
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage.set('E-mail ou senha incorretos.');
        } else if (err.status === 0) {
          this.errorMessage.set('Não foi possível conectar ao servidor. Verifique sua conexão.');
        } else {
          this.errorMessage.set('Ocorreu um erro ao realizar o login. Tente novamente mais tarde.');
        }
      }
    });
  }

  onForgotPassword(event: Event): void {
    event.preventDefault();
    alert('Esta funcionalidade será implementada em breve.');
  }
}
