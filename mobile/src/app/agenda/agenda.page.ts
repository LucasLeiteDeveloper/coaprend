import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: false,
})
export class AgendaPage implements OnInit {
 currentWeek: Date[] = [];
  currentDate: Date = new Date();
  weekRange: string = '';

  constructor() {}

  ngOnInit() {
    this.updateWeek(this.currentDate);
  }

  updateWeek(date: Date) {
    this.currentWeek = [];
    const firstDay = this.getFirstDayOfWeek(date);

    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      this.currentWeek.push(day);
    }
    
    // Calcula o intervalo de datas e atualiza a variável weekRange
    const firstDayNum = this.currentWeek[0].getDate();
    const lastDayNum = this.currentWeek[6].getDate();
    this.weekRange = `${firstDayNum}-${lastDayNum}`;
  }

  getFirstDayOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Ajusta para o domingo
    return new Date(d.setDate(diff));
  }

  formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  prevWeek() {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateWeek(this.currentDate);
  }

  nextWeek() {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateWeek(this.currentDate);
  }
}