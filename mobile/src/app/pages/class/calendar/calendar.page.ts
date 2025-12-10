import { Component, contentChild, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/postService/post';
import { ClassPage } from '../class.page';
import { ContentService } from 'src/app/services/contentService/content-service';
import { PostPageRoutingModule } from '../../post/post-routing.module';

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

  classId: string | null = null;

  public showingDayOnly: boolean = true;

  constructor(
    private contentService: ContentService,
    private postService: PostService,
    private classPage: ClassPage
  ) {}

  ngOnInit(): void {
    this.classId = localStorage.getItem("classId");

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
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().split('T')[0];
  }

  private timestampToDate(timestamp: any): Date {
    if (!timestamp) return new Date();
    
    if (timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      
      return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    }
    
    // Se já for Date ou string ISO
    return new Date(timestamp);
  }

  private updateSelectedWeek(date: Date): void {
    console.log("Data atual: ", this.selectedDate)
    this.daysOfSelectedWeek = [];
    this.selectedDay = null;

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

  private async loadTasksOfWeek() {
    if(!this.classId) return;

    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    await this.contentService.getTaskByClassAndWeek(this.classId, start, end).subscribe({
      next: (tasks) => {
        this.showingDayOnly = false;

        // transform the dates of tasks in an Date obj
        tasks.forEach( (t) => {
          t.dt_final = this.timestampToDate(t.dt_final);
          t.formattedDate = this.dateToYMD(t.dt_final);
        });

        this.tasksOfWeek = tasks;
        console.log("Tasks da semana: ", this.tasksOfWeek);
      },
      error: (error) => console.error("Erro: ", error)
    });
  }

  private async loadPostsOfWeek() {
    if(!this.classId) return;

    const start = this.dateToYMD(this.daysOfSelectedWeek[0]);
    const end = this.dateToYMD(this.daysOfSelectedWeek[6]);

    await this.contentService.getPostByClassAndWeek(this.classId, start, end).subscribe({
      next: (posts) => {
        this.showingDayOnly = false;

        // transform the dates of posts in an Date obj
        posts.forEach( (p) => {
          p.dt_create = this.timestampToDate(p.dt_create);
          p.formattedDate = this.dateToYMD(p.dt_create);
        } );


        this.postsOfWeek = posts;
        console.log("posts da semana: ", this.postsOfWeek);
      },
      error: (error) => console.error("Erro: ", error)
    });
  }

  public selectDay(day: Date): void {
    this.selectedDay = day;
    this.showingDayOnly = true;
    this.applyTagFilter();

    this.updateDayView();
  }
  private updateDayView(){
    if(this.selectedDay) {
      const selectedYMD = this.dateToYMD(this.selectedDay);

      //filter the tasks of day
      this.tasksOfSelectedDay = this.tasksOfWeek.filter(task => {
        const taskYMD = this.dateToYMD(task.dt_final);

        return taskYMD === selectedYMD;
      });

      //filter the posts of day
      this.postsOfSelectedDay = this.postsOfWeek.filter(post => {
        const postYMD = this.dateToYMD(post.dt_create);

        return postYMD === selectedYMD;
      });

      console.log("Tasks do dia: ", this.tasksOfSelectedDay)
      console.log("Posts do dia: ", this.postsOfSelectedDay);
    }
  }

  private applyTagFilter(): void {
    const selectedTags = this.classPage.tags
      .filter(t => t.selected)
      .map(t => t.text);

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
