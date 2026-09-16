import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() isCollapsed: boolean = false;

  // Simplified core navigation items
  menuItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Produtos', route: '/products', icon: 'products' },
    { label: 'Galeria', route: '/gallery', icon: 'gallery' },
    { label: 'Pedidos', route: '/orders', icon: 'orders' },
    { label: 'Clientes', route: '/customers', icon: 'customers' },
    { label: 'Configurações', route: '/settings', icon: 'settings' }
  ];
}
