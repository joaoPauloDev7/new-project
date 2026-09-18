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
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Produtos', route: '/admin/products', icon: 'products' },
    { label: 'Galeria', route: '/admin/gallery', icon: 'gallery' },
    { label: 'Pedidos', route: '/admin/orders', icon: 'orders' },
    { label: 'Estoque', route: '/admin/stock', icon: 'stock' },
    { label: 'Clientes', route: '/admin/customers', icon: 'customers' },
    { label: 'Configurações', route: '/admin/settings', icon: 'settings' }
  ];
}
