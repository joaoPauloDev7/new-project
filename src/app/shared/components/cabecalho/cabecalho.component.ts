import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-cabecalho',
  imports: [],
  standalone: true,
  templateUrl: './cabecalho.component.html',
  styleUrl: './cabecalho.component.scss'
})
export class CabecalhoComponent {
  private authService = inject(AuthService);

  // Expose current user signal
  currentUser = this.authService.currentUser;

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    const names = user.name.trim().split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  }
}
