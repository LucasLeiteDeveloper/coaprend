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
    try {
      const classId = localStorage.getItem("classId");

      if(!classId)  throw new Error("Classe não especificada");
      const responseTasks = await this.contentService.getTasks(classId);

      responseTasks?.forEach(task => task.dt_final = new Date(task.dt_final._seconds * 1000));

      console.log("Tasks: ", responseTasks);
      if(responseTasks) this.tasks = responseTasks;

      await this.loading?.dismiss();
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

  async viewTask(task: any) {
    const alert = await this.alertCtrl.create({
      header: "Tarefa",
      message: "Tarefa específica"
    });

    await alert.present();
  }

  // prepare the tags to show in alertCtrl
  private formatTagsForAlertCtrl(tags: any[]){
    if(!tags || !Array.isArray(tags)) return '';

    return tags.map( tag => typeof tag === 'string' ? tag : tag.name || tag )
              .join(', ');
  }

  // prepare the dateto show in AlertCtrl
  private formatDateForAlertCtrl(date: any): string {
    if(!date) return '';

    let dateObj: Date;

    // if is timestamp
    if(date._seconds) {
      dateObj = new Date(date._seconds * 1000);
    } else if(date instanceof Date ) {// if is already a Date
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }

    return dateObj.toISOString().split('T')[0]
  }

  async editTask(task: any) {
    const alert = await this.alertCtrl.create({
      header: "Editar tarefa",
      inputs: [
        { 
          name: 'title',
          type: 'text',
          placeholder: 'Título',
          value: task.title || '',
          attributes: {
            required: true
          }
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Descrição',
          value: task.description || '',
          attributes: {
            rows: 4
          }
        },
        {
          name: 'dt_final',
          type: 'date',
          placeholder: 'Data de Entrega',
          value: this.formatDateForAlertCtrl(task.dt_final),
          min: new Date().toISOString().split('T')[0],
          attributes: {
            required: true
          }
        },
        {
          name: 'tags',
          type: 'text',
          placeholder: 'Tags (separadas por vírgula)',
          value: this.formatTagsForAlertCtrl(task.tags)
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: "Salvar",
          handler: async (data) => {
            if(!data.title || !data.dt_final) {
              this.presentErrorAlert('Erro', 'Título e data são obrigatórios');
              return false;
            }
            console.log("Entrando em saveTaskChanges..")
            await this.saveTaskChanges(task.id, data);
            return false;
          }
        }
      ]
    })
    await alert.present();

    this.navCtrl.navigateForward(`/class/task/edit/${task.id}`);
  }
  private async saveTaskChanges(id: any, data: any){
    const loading = await this.loadingCtrl.create({
      message: "Salvando alterações..",
      spinner: 'crescent'
    });

    await loading.present();

    try{
      // prepare data to send
      const updateData: any = {
        title: data.title,
        description: data.description,
        dt_final: data.dt_final
      };

      // convert tags for string to array
      if(data.tags && data.tags.trim()){
        updateData.tags = data.tags
                            .split(',')
                            .map((tag: string) => tag.trim())
                            .filter(( tag: string ) => tag.length > 0);
      } else {
        updateData.tags = [];
      }
      
      //calls API to update
      this.contentService.updateTask(id, updateData);

      this.loadTasks();
      
      loading.dismiss();

      this.loadTasks();
    } catch(error: any){
      await loading.dismiss();
      console.error("Erro ao salvar tarefa: ", error);
      this.presentErrorAlert("Erro", error.error?.error || "Não foi possível atualizar a tarefa");
    }
  }

  async confirmDelete(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Excluir tarefa?',
      message: 'Essa ação não pode ser desfeita.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Excluir', handler: async () => {
          this.loading = await this.loadingCtrl.create({ message: 'Excluindo tarefa...' });
          await this.loading.present();

          try {
            await this.contentService.deleteTask(id);

            this.loading.dismiss();
          } catch(error){
            this.loading.dismiss();

            this.presentErrorAlert("Erro ao deletar", "erro de conexão");

            console.error("Erro ao deletar tarefa: ", error);
          }

          this.loadTasks();
        }}
      ]
    });
    await alert.present();
    }

    async presentErrorAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
          header: header,
          message: message,
          buttons: ['OK']
      });
      await alert.present();
    }
}
