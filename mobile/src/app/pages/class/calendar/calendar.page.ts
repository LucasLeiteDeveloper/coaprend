import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {
    this.updateSelectedWeek(this.selectedDate);
  }

  private getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = date.getDate() - dayOfWeek;
    return new Date(date.setDate(firstDayOfWeek));
  }

  private updateSelectedWeek(date: Date): void {
    this.daysOfSelectedWeek = [];
    this.selectedDay = null;

    const firstDayOfWeek: Date = this.getFirstDayOfWeek(new Date(date));
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const day: Date = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + dayOfWeek);
      this.daysOfSelectedWeek.push(day);
    }

    this.currentMonth = this.formatMonth(this.selectedDate);
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

  public selectDay(day: Date): void {
    this.selectedDay = day;
  }
}
