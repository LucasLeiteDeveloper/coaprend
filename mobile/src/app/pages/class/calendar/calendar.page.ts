
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

interface Post {
  title: string;
  content: string;
  postDate: string;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  standalone: false,
})
export class CalendarPage implements OnInit {
  public currentDate: Date = new Date();
  public currentWeek: Date[] = [];
  public weekRange: string = '';
  public posts: Post[] = [];
  public filteredPosts: Post[] = [];
  public selectedDate: Date | null = null;

  constructor(private alertController: AlertController) {}

  ngOnInit() {
    this.loadPosts();
    this.updateWeek(this.currentDate);
  }

  loadPosts() {
    const storedPosts = localStorage.getItem('posts');
    if (storedPosts) {
      this.posts = JSON.parse(storedPosts);
    }
  }
  savePosts() {
    localStorage.setItem('posts', JSON.stringify(this.posts));
  }

  async showCreatePostAlert() {
    const alert = await this.alertController.create({
      header: 'Criar Novo Post',
      inputs: [
        { name: 'title', type: 'text', placeholder: 'Título' },
        { name: 'content', type: 'textarea', placeholder: 'Conteúdo' },
        {
          name: 'postDate',
          type: 'date',
          placeholder: 'Data',
          value: this.formatDate(this.selectedDate || new Date()),
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel', cssClass: 'secondary' },
        {
          text: 'Criar',
          handler: (data) => {
            const newPost: Post = {
              title: data.title,
              content: data.content,
              postDate: data.postDate,
            };
            this.posts.push(newPost);
            this.savePosts();
            this.filterPostsByDate(this.selectedDate);
          },
        },
      ],
    });
    await alert.present();
  }

  filterPostsByDate(date: Date | null) {
    if (!date) {
      this.filteredPosts = [];
      return;
    }
    const formattedDate = this.formatDate(date);
    this.filteredPosts = this.posts.filter(
      (post) => post.postDate === formattedDate
    );
  }
  filterPostsByWeek() {
    const firstDayOfWeek = this.currentWeek[0];
    const lastDayOfWeek = this.currentWeek[6];
    this.filteredPosts = this.posts.filter((post) => {
      const postDate = new Date(post.postDate);
      return postDate >= firstDayOfWeek && postDate <= lastDayOfWeek;
    });
  }
  filterPostsByMonth() {
    const currentMonth = this.currentDate.getMonth();
    const currentYear = this.currentDate.getFullYear();
    this.filteredPosts = this.posts.filter((post) => {
      const postDate = new Date(post.postDate);
      return (
        postDate.getMonth() === currentMonth &&
        postDate.getFullYear() === currentYear
      );
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateWeek(date: Date) {
    this.currentWeek = [];
    const firstDay = this.getFirstDayOfWeek(date);

    for (let i = 0; i < 7; i++) {
      const day = new Date(firstDay);
      day.setDate(firstDay.getDate() + i);
      this.currentWeek.push(day);
    }

    const firstDayNum = this.currentWeek[0].getDate();
    const lastDayNum = this.currentWeek[6].getDate();
    this.weekRange = `${firstDayNum}-${lastDayNum}`;

    this.filteredPosts = [];
    this.selectedDate = null;
  }

  getFirstDayOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
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

  selectDate(day: Date) {
    this.selectedDate = day;
    this.filterPostsByDate(day);
  }
}