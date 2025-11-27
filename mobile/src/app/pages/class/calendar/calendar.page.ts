import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { PostService } from 'src/app/services/postService/post';
import { ClassPage } from '../class.page';

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
  public postsOfWeek: any[] = [];

  public tasksOfSelectedDay: any[] = [];
  public postsOfSelectedDay: any[] = [];

  public showingDayOnly: boolean = false;

  constructor(
    private taskService: TaskService,
    private postService: PostService,
    private classPage: ClassPage
  ) {}

  ngOnInit(): void {
    this.updateSelectedWeek(this.selectedDate);

    // Atualiza filtros em tempo real
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
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

  private loadTasksOfWeek(): void {
    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    this.taskService.getTasksByDateRange(start, end).subscribe(tasks => {
      this.tasksOfWeek = tasks;
      this.applyTagFilter();
    });
  }

  private loadPostsOfWeek(): void {
    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    this.postService.get.byDateRange(start, end).subscribe(posts => {
      this.postsOfWeek = posts;
      this.applyTagFilter();
    });
  }

  public selectDay(day: Date): void {
    this.selectedDay = day;
    this.showingDayOnly = true;
    this.applyTagFilter();
  }

  private applyTagFilter(): void {
    const selectedTags = this.classPage.tags
      .filter((t: any) => t.selected)
      .map((t: any) => t.text);

    // Filtrar tarefas da semana
    this.tasksOfSelectedDay = this.tasksOfWeek
      .filter(task => !selectedTags.length || task.tags?.some((t: any) => selectedTags.includes(t.name ?? t)));

    // Filtrar posts da semana
    this.postsOfSelectedDay = this.postsOfWeek
      .filter(post => !selectedTags.length || post.tags?.some((t: any) => selectedTags.includes(t.name ?? t)));

    // Se um dia estiver selecionado, limitar a esse dia
    if (this.showingDayOnly && this.selectedDay) {
      const ymd = this.dateToYMD(this.selectedDay);

      this.tasksOfSelectedDay = this.tasksOfSelectedDay.filter(task =>
        (task.data_limite ?? '').split('T')[0] === ymd
      );

      this.postsOfSelectedDay = this.postsOfSelectedDay.filter(post =>
        (post.date ?? '').split('T')[0] === ymd
      );
    }
  }

  public formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  public formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  public formatMonth(date: Date): string {
    return date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  }

  public goToPrevWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() - 7);
    this.updateSelectedWeek(this.selectedDate);
  }

  public goToNextWeek(): void {
    this.selectedDate.setDate(this.selectedDate.getDate() + 7);
    this.updateSelectedWeek(this.selectedDate);
  }
}
