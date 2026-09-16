import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { RegisterPageComponent } from './features/auth/pages/register-page/register-page.component';
import { ForgotPasswordPageComponent } from './features/auth/pages/forgot-password-page/forgot-password-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { ProductsPageComponent } from './features/products/pages/products-page/products-page.component';
import { OrdersPageComponent } from './features/orders/pages/orders-page/orders-page.component';
import { CustomersPageComponent } from './features/customers/pages/customers-page/customers-page.component';
import { GalleryPageComponent } from './features/gallery/pages/gallery-page/gallery-page.component';
import { SettingsPageComponent } from './features/settings/pages/settings-page/settings-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPageComponent },
      { path: 'products', component: ProductsPageComponent },
      { path: 'gallery', component: GalleryPageComponent },
      { path: 'orders', component: OrdersPageComponent },
      { path: 'customers', component: CustomersPageComponent },
      { path: 'settings', component: SettingsPageComponent }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: RegisterPageComponent },
      { path: 'forgot-password', component: ForgotPasswordPageComponent }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
