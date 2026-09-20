import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STORE_CONFIG } from '../../../../core/config/store.config';
import { StoreService } from '../../../../core/services/store.service';

@Component({
  selector: 'app-store-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './store-footer.component.html',
  styleUrls: ['./store-footer.component.scss']
})
export class StoreFooterComponent {
  private storeService = inject(StoreService);
  categories = this.storeService.categories;

  storeName = STORE_CONFIG.name;
  currentYear = new Date().getFullYear();
  whatsappLink = `https://wa.me/${STORE_CONFIG.whatsappNumber}`;
}
