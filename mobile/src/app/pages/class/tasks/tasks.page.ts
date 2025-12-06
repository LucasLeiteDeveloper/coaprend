import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { ClassPage } from '../class.page';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-task',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {
  tasks: any[] = [];
  filteredTasks: any[] = [];
  loading: HTMLIonLoadingElement | null = null;

  constructor(
    private taskService: TaskService,
    private contentService: ContentService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private classPage: ClassPage
  ) {}

  async ngOnInit() {
    await this.loadTasks();

    // Atualiza filtro em tempo real
    this.classPage.tagFilter$.subscribe(() => {
      this.applyTagFilter();
    });
  }

  async loadTasks(event?: any) {
    if (!event) {
      this.loading = await this.loadingCtrl.create({ message: 'Carregando tarefas...' });
      await this.loading.present();
    }

    this.taskService.getAll().subscribe({
      next: async (res) => {
        this.tasks = res?.data || res || [];
        this.applyTagFilter();

        if (this.loading) await this.loading.dismiss();
        if (event) event.target.complete();
      },
      error: async () => {
        if (this.loading) await this.loading.dismiss();
        if (event) event.target.complete();
      }
    });
    try {
      const classId = localStorage.getItem("classId");

      if(!classId)  throw new Error("Classe não especificada");
      const responseTasks = await this.contentService.getTasks(classId);

      responseTasks?.forEach(task => task.dt_final = new Date(task.dt_final._seconds * 1000));

      console.log("Tasks: ", responseTasks);
      if(responseTasks) this.tasks = responseTasks;
    } catch(error){
      console.error("Erro ao pegar classes: ", error);
    }

  }

  private applyTagFilter() {
    const selectedTags = this.classPage.tags
      .filter((t: any) => t.selected)
      .map((t: any) => t.text);

    if (!selectedTags.length) {
      this.filteredTasks = [...this.tasks];
      return;
    }

    this.filteredTasks = this.tasks.filter(task =>
      task.tags?.some((t: any) => selectedTags.includes(t.name ?? t))
    );
  }

  viewTask(id: string) {
    this.navCtrl.navigateForward(`/class/task/view/${id}`);
  }

  editTask(id: string) {
    this.navCtrl.navigateForward(`/class/task/edit/${id}`);
  }

  async confirmDelete(id: string) {
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

  deleteTask(id: string) {
    console.log(id)
    // this.taskService.delete(id).subscribe(() => {
    //   this.tasks = this.tasks.filter(t => t.id !== id);
    //   this.applyTagFilter();
    // });
  }
}
