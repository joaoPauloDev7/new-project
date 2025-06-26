import { Component } from '@angular/core';
import { CabecalhoComponent } from './components/cabecalho/cabecalho.component';
import { MenuComponent } from './components/menu/menu.component';
import { NoticiasComponent } from './telas/noticias/noticias.component';
import { VaqueirosComponent } from './telas/vaqueiros/vaqueiros.component';
import { LocaisComponent } from './telas/locais/locais.component';
import { LivesComponent } from './telas/lives/lives.component';

@Component({
  selector: 'app-root',
  imports: [CabecalhoComponent, MenuComponent, NoticiasComponent, VaqueirosComponent, LocaisComponent, LivesComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'new-project';
  secaoAtiva = 'asdasd';
  
  onSelecionado(secao: string) {
    debugger
    this.secaoAtiva = secao;
  }
}
