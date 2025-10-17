import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})

export class CalendarPage implements OnInit {
  public currentDate: Date = new Date();
  public currentDaysOfWeek: Date[] = [];
  public weekRangeDisplay: string = '';
  public selectedDay: Date | null = null;

  constructor() {}

  ngOnInit(): void {
    this.updateWeek(this.currentDate);
  }

  public getFirstDayOfWeek(date: Date): Date {
    const dayOfWeek = date.getDay();
    const firstDayOfWeek = date.getDate() - dayOfWeek;
    return new Date(date.setDate(firstDayOfWeek));
  }

  public updateWeek(date: Date): void {
    this.currentDaysOfWeek = [];
    this.selectedDay = null;

    const firstDayOfWeek: Date = this.getFirstDayOfWeek(date);
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      const day: Date = new Date(firstDayOfWeek);
      day.setDate(firstDayOfWeek.getDate() + dayOfWeek);
      this.currentDaysOfWeek.push(day);
    }

    const firstDayNum: number = firstDayOfWeek.getDate();
    const lastDayNum: number = this.currentDaysOfWeek[6].getDate();
    this.weekRangeDisplay = `${firstDayNum}-${lastDayNum}`;
  }

  public formatDate(date: Date): string {
    const year: string = date.getFullYear().toString();
    const month: string = (date.getMonth() + 1).toString().padStart(2, '0');
    const day: string = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  public formatDay(date: Date): string {
    return date.toLocaleString('pt-BR', { day: 'numeric' });
  }

  public formatWeekday(date: Date): string {
    return date.toLocaleString('pt-BR', { weekday: 'short' });
  }

  public goToPrevWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() - 7);
    this.updateWeek(this.currentDate);
  }

  public goToNextWeek(): void {
    this.currentDate.setDate(this.currentDate.getDate() + 7);
    this.updateWeek(this.currentDate);
  }

  public selectDay(day: Date): void {
    this.selectedDay = day;
  }
}