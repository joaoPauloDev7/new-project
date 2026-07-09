import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [],
  standalone: true,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;

  stats = [
    { title: 'Total de Vendas', value: 'R$ 45.230,89', change: '+12.5% vs mês anterior', isPositive: true, icon: 'sales' },
    { title: 'Produtos Ativos', value: '142', change: '+4 novos esta semana', isPositive: true, icon: 'products' },
    { title: 'Novos Clientes', value: '38', change: '+8.2% vs mês anterior', isPositive: true, icon: 'clients' },
    { title: 'Taxa de Conversão', value: '2.8%', change: '-0.3% vs mês anterior', isPositive: false, icon: 'rate' }
  ];

  recentSales = [
    { id: '#1024', client: 'João Paulo Dev', date: 'Hoje, 14:32', total: 'R$ 350,00', status: 'completed', statusLabel: 'Concluído' },
    { id: '#1023', client: 'Maria Silva', date: 'Hoje, 11:15', total: 'R$ 1.250,50', status: 'completed', statusLabel: 'Concluído' },
    { id: '#1022', client: 'Carlos Santos', date: 'Ontem, 17:45', total: 'R$ 89,90', status: 'pending', statusLabel: 'Pendente' },
    { id: '#1021', client: 'Ana Oliveira', date: 'Ontem, 09:20', total: 'R$ 420,00', status: 'cancelled', statusLabel: 'Cancelado' }
  ];
}
