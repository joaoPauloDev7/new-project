import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CabecalhoComponent } from '../../shared/components/cabecalho/cabecalho.component';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CabecalhoComponent, MenuComponent],
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout();
  }
}
