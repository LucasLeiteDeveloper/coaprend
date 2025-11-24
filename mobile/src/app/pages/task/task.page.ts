import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  tasks: any[] = [];
  loading: HTMLIonLoadingElement | null = null;
  public taskExample: {} = {
    title: 'Post de teste',
    dueDate: '25/10/2025',
    content: "Lorem"
  };

  constructor(
    private taskService: TaskService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks(event?: any) {
    if (!event) {
      this.loading = await this.loadingCtrl.create({ message: 'Carregando tarefas...' });
      await this.loading.present();
    }

    this.taskService.getAll().subscribe({
      next: async (res) => {
        this.tasks = res?.data || res || [];

        if (this.loading) await this.loading.dismiss();
        if (event) event.target.complete();
      },
      error: async () => {
        if (this.loading) await this.loading.dismiss();
        if (event) event.target.complete();
      }
    });
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
        {
          text: 'Excluir',
          handler: () => this.deleteTask(id)
        }
      ]
    });

    await alert.present();
  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
    });
  }
}
