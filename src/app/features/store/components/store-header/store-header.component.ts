import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { STORE_CONFIG } from '../../../../core/config/store.config';

@Component({
  selector: 'app-store-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './store-header.component.html',
  styleUrls: ['./store-header.component.scss']
})
export class StoreHeaderComponent {
  cartService = inject(CartService);
  isMobileMenuOpen = signal(false);

  storeName = STORE_CONFIG.name;
  whatsappLink = `https://wa.me/${STORE_CONFIG.whatsappNumber}`;

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
  }
}
