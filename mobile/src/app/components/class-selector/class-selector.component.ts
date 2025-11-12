import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'class-selector',
  templateUrl: './class-selector.component.html',
  styleUrls: ['./class-selector.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class ClassSelectorComponent implements OnInit {
  salas: any[] = []; // Lista de salas vindas do backend
  selectedSala: number | null = null; // ID da sala selecionada

  @Output() salaSelecionada = new EventEmitter<number>(); // Envia o ID pro componente pai

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarSalas();
  }

  carregarSalas() {
    // Precisa substituir pelo da api
    this.http.get<any[]>('https://localhost:8000/api/get_salas.php').subscribe({
      next: (data) => {
        this.salas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar salas:', err);
      },
    });
  }

  onSelectSala(event: any) {
    this.selectedSala = event.detail.value; // (ionChange) envia o valor em detail.value
    if (this.selectedSala !== null) {
      this.salaSelecionada.emit(this.selectedSala);
    }
  }

  getNomeSalaSelecionada(): string {
    const sala = this.salas.find((s) => s.id_sala === this.selectedSala);
    return sala ? sala.nome : '';
  }
}
