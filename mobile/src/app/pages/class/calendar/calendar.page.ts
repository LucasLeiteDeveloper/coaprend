import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit {

  public selectedDate: Date = new Date();
  public selectedDay: Date | null = null;
  public daysOfSelectedWeek: Date[] = [];
  public currentMonth: string = '';

  tasks: any[] = []; // todas as tarefas vindas da API
  weeklyTasks: any[] = []; // tarefas filtradas da semana

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
    this.updateSelectedWeek(this.selectedDate);
  }

  // --- BUSCAR TODAS AS TAREFAS ---
  loadTasks() {
    this.taskService.getAll().subscribe({
      next: (res) => {
        this.tasks = res;
        this.filterTasksByWeek();
      },
      error: (err) => console.error("Erro ao carregar tarefas", err),
    });
  }

  // --- FILTRAR PELA SEMANA SELECIONADA ---
  filterTasksByWeek() {
    const start = this.daysOfSelectedWeek[0];
    const end = this.daysOfSelectedWeek[6];

    this.weeklyTasks = this.tasks.filter((t) => {
      const date = new Date(t.data_limite);
      return date >= start && date <= end;
    });
  }

  // --- CÁLCULO DE SEMANA ---
  private getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = date.getDate() - dayOfWeek;
    return new Date(date.setDate(firstDayOfWeek));
  }

  private updateSelectedWeek(date: Date): void {
    this.daysOfSelectedWeek = [];
    this.selectedDay = null;

    const firstDayOfWeek: Date = this.getFirstDayOfWeek(new Date(date));

    for (let i = 0; i < 7; i++) {
      const day: Date = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + i);
      this.daysOfSelectedWeek.push(day);
    }

    this.currentMonth = this.formatMonth(this.selectedDate);

    this.filterTasksByWeek(); // ← atualiza sempre que semana mudar
  }

  // --- FORMATAÇÕES ---
  public formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  public formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  public formatMonth(date: Date): string {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  }

  // --- NAVEGAÇÃO ENTRE SEMANAS ---
public goToPrevWeek(): void {
  this.selectedDate.setDate(this.selectedDate.getDate() - 7);
  this.updateSelectedWeek(this.selectedDate);
  this.loadTasks(); // ← recarrega tarefas e exibe as da nova semana
}

public goToNextWeek(): void {
  this.selectedDate.setDate(this.selectedDate.getDate() + 7);
  this.updateSelectedWeek(this.selectedDate);
  this.loadTasks(); // ← recarrega tarefas e exibe as da nova semana
}


  public selectDay(day: Date): void {
    this.selectedDay = day;
  }
}
