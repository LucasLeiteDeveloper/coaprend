import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';

@Component({
  selector: 'app-task',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {
  public loaded: boolean = false;
  public tasks: any;
  public filteredTasks: any;
  loading: HTMLIonLoadingElement | null = null;
  public taskExample: any = {
    id: 0,
    dueDate: "26/11/2025",
    title: "Configurar Ambiente de Desenvolvimento Local",
    content: "Instalar Node.js, npm, VS Code e as extensões essenciais. Clonar o repositório principal e rodar 'npm install' para garantir que todas as dependências estejam instaladas.",
    tags: [
      1,
      3,
    ]
  };

  constructor(
    private taskService: TaskService,
  ) {}

  async ngOnInit() {
    this.loaded = false;
    // await this.loadTasks();
  }

  // async loadTasks(event?: any) {
  //   if (!event) {
  //     this.loading = await this.loadingCtrl.create({ message: 'Carregando tarefas...' });
  //     await this.loading.present();
  //   }

  //   this.taskService.getAll().subscribe({
  //     next: async (res) => {
  //       this.tasks = res?.data || res || [];

  //       if (this.loading) await this.loading.dismiss();
  //       if (event) event.target.complete();
  //     },
  //     error: async () => {
  //       if (this.loading) await this.loading.dismiss();
  //       if (event) event.target.complete();
  //     }
  //   });
  // }
}
