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
  tasks: any;
  filteredTasks: any;
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

    // Atualiza filtro em tempo real
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
  }

  async loadTasks(event?: any) {
    this.http.get("assets/task-data.json").subscribe({
      next: (data) => {
        this.tasks = data;
        this.applyTagFilter();
        this.tasks = this.filteredTasks;
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
      .filter((t: any) => t.selected)
      .map((t: any) => t.id);

    if (!selectedTags.length) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter((task: any) =>
      task.tags?.some((t: any) => selectedTags.includes(t.id ?? t))
    );
  }

  viewTask(id: number) {
    this.navCtrl.navigateForward(`/class/task/view/${id}`);
  }

  editTask(id: number) {
    this.navCtrl.navigateForward(`/class/task/edit/${id}`);
  }

  async confirmDelete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir tarefa?',
      message: 'Essa ação não pode ser desfeita.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', handler: () => this.deleteTask(id) }
      ]
    });
    await alert.present();
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter((t: any) => t.id !== id);
      this.applyTagFilter();
    });
  }
}
