import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  noticias: boolean = false

  @Output() selecao = new EventEmitter<string>();

  selecionar(secao: string) {
    debugger
    this.selecao.emit(secao);
  }
}
