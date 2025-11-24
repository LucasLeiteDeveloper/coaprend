import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { PostService } from 'src/app/services/postService/post';

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

  // tarefas
  public tasksOfWeek: any[] = [];
  public tasksOfSelectedDay: any[] = [];

  // posts
  public postsOfWeek: any[] = [];
  public postsOfSelectedDay: any[] = [];

  public showingDayOnly: boolean = false;

  constructor(
    private taskService: TaskService,
    private postService: PostService
  ) {}

  ngOnInit(): void {
    this.updateSelectedWeek(this.selectedDate);
  }

  private getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const firstDayDate = date.getDate() - dayOfWeek;
    return new Date(date.setDate(firstDayDate));
  }

  private dateToYMD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private updateSelectedWeek(date: Date): void {
    this.daysOfSelectedWeek = [];
    this.selectedDay = null;
    this.showingDayOnly = false;

    const firstDay = this.getFirstDayOfWeek(new Date(date));

    for (let d = 0; d < 7; d++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + d);
      this.daysOfSelectedWeek.push(day);
    }

    this.currentMonth = this.formatMonth(this.selectedDate);

    this.loadTasksOfWeek();
    this.loadPostsOfWeek();
  }

  // ============================================================
  // 🔵 CARREGAR TAREFAS DA SEMANA
  // ============================================================
  private loadTasksOfWeek(): void {
    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    this.taskService.getTasksByDateRange(start, end).subscribe((tasks) => {
      this.tasksOfWeek = tasks;
      this.tasksOfSelectedDay = [];
    });
  }

  // ============================================================
  // 🔵 CARREGAR POSTS DA SEMANA
  // ============================================================
  private loadPostsOfWeek(): void {
    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    this.postService.getPostsByDateRange(start, end).subscribe((posts) => {
      this.postsOfWeek = posts;
      this.postsOfSelectedDay = [];
    });
  }

  // ============================================================
  // 🔵 CARREGAR SOMENTE DO DIA SELECIONADO
  // ============================================================
  public selectDay(day: Date): void {
    this.selectedDay = day;
    this.loadTasksOfDay(day);
    this.loadPostsOfDay(day);
    this.showingDayOnly = true;
  }

  private loadTasksOfDay(day: Date): void {
    const ymd = this.dateToYMD(day);

    this.tasksOfSelectedDay = this.tasksOfWeek.filter(task => {
      const taskDate = (task.data_limite ?? '').split('T')[0];
      return taskDate === ymd;
    });
  }

  private loadPostsOfDay(day: Date): void {
    const ymd = this.dateToYMD(day);

    this.postsOfSelectedDay = this.postsOfWeek.filter(post => {
      const date = (post.date ?? '').split('T')[0];
      return date === ymd;
    });
  }

  // ============================================================
  // FORMATAÇÕES
  // ============================================================
  public formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  public formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  public formatMonth(date: Date): string {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  }

  // ============================================================
  // NAVEGAÇÃO DA SEMANA
  // ============================================================
  public goToPrevWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.updateSelectedWeek(this.selectedDate);
  }

  public goToNextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.updateSelectedWeek(this.selectedDate);
  }
}
