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

  public tasksOfWeek: any[] = [];
  public tasksOfSelectedDay: any[] = [];
  public showingDayOnly: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.updateSelectedWeek(this.selectedDate);
  }

  private getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = date.getDate() - dayOfWeek;
    return new Date(date.setDate(firstDayOfWeek));
  }

  private dateToYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private updateSelectedWeek(date: Date): void {
    this.daysOfSelectedWeek = [];
    this.selectedDay = null;
    this.showingDayOnly = false;

    const firstDayOfWeek = this.getFirstDayOfWeek(new Date(date));

    for (let d = 0; d < 7; d++) {
      const day = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + d);
      this.daysOfSelectedWeek.push(day);
    }

    this.currentMonth = this.formatMonth(this.selectedDate);

    this.loadTasksOfWeek();
  }

  private loadTasksOfWeek(): void {
    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    this.taskService.getTasksByDateRange(start, end).subscribe((tasks) => {
      this.tasksOfWeek = tasks;
      this.tasksOfSelectedDay = [];
      this.showingDayOnly = false;
    });
  }

  private loadTasksOfDay(day: Date): void {
    const selectedYMD = this.dateToYMD(day);

    this.tasksOfSelectedDay = this.tasksOfWeek.filter((task) => {
      const taskDate = task.data_limite?.split('T')[0] ?? task.data_limite;
      return taskDate === selectedYMD;
    });

    this.showingDayOnly = true;
  }

  // =====================
  //  FORMATAÇÕES
  // =====================

  public formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  public formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  public formatMonth(date: Date): string {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  }

  // =====================
  // CONTROLES DO CALENDÁRIO
  // =====================

  public goToPrevWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.updateSelectedWeek(this.selectedDate);
  }

  public goToNextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.updateSelectedWeek(this.selectedDate);
  }

  public selectDay(day: Date): void {
    this.selectedDay = day;
    this.loadTasksOfDay(day);
  }
}
