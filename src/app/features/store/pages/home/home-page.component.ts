import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../../../core/services/store.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { STORE_CONFIG } from '../../../../core/config/store.config';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ProductCardComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent implements OnInit {
  private storeService = inject(StoreService);
  private seoService = inject(SeoService);

  featuredProducts = this.storeService.featuredProducts;
  categories = this.storeService.categories;
  newProducts = this.storeService.newProducts;

  storeName = STORE_CONFIG.name;
  whatsappLink = `https://wa.me/${STORE_CONFIG.whatsappNumber}`;

  ngOnInit(): void {
    this.seoService.setPageMeta(
      'Coleção Permanente',
      'Barone Store — Moda masculina premium, alfaiataria contemporânea e peças essenciais com caimento impecável.'
    );
  }
}
