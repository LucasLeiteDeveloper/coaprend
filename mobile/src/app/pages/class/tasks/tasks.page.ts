import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ClassPage } from '../class.page';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {
  public tasks: any;
  public filteredTasks: any;
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private taskService: TaskService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private classPage: ClassPage,
    private http: HttpClient,
  ) {}

  async ngOnInit() {
    await this.loadTasks();
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
  }

  async loadTasks(event?: any) {
    this.http.get("assets/task-data.json").subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyTagFilter();
        console.log('Posts carregados:', this.tasks);
      },
      error: (err) => {
        console.error('Erro ao carregar posts:', err);
      },
    });
    // if (!event) {
    //   this.loading = await this.loadingCtrl.create({ message: 'Carregando tarefas...' });
    //   await this.loading.present();
    // }

    // this.taskService.getAll().subscribe({
    //   next: async (res) => {
    //     this.tasks = res?.data || res || [];
    //     this.applyTagFilter();

    //     if (this.loading) await this.loading.dismiss();
    //     if (event) event.target.complete();
    //   },
    //   error: async () => {
    //     if (this.loading) await this.loading.dismiss();
    //     if (event) event.target.complete();
    //   }
    // });
  }

  private applyTagFilter() {
    const selectedTags = this.classPage.tags
      .filter((tag: any) => tag.selected == true)
      .map((tag: any) => tag.id);

    if (!selectedTags || Object.keys(selectedTags).length == 0) return;

    const filteredTasks = this.tasks
      .filter((task: any) => task.tags
      .some((tag: any) => selectedTags.includes(tag.id ?? tag)));

    this.tasks = filteredTasks;
  }
}
