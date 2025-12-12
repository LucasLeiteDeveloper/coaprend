import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  title = '';
  description = '';
  dt_final!: Date;
  
  classId!: string | null;

  tags: string[] = [];
  userClasses!: any;
  attachments: File[] = [];

  isSubmitting = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController,
    private contentService: ContentService
  ) {}

  async ngOnInit() {
    await this.loadData();
  }

  async loadData(){
    
    try {
      const response = await this.contentService.getUserClasses();

      this.userClasses = response;
      console.log("Classes: ", this.userClasses);
    } catch(error){
      console.log("Erro ao pegar as salas do usuário: ", error);
    }
  }

  /* --------------------- TAGS ---------------------- */
  async openTagPrompt() {
    const alert = await this.alertCtrl.create({
      header: 'Adicionar Tag',
      inputs: [{ name: 'tag', type: 'text', placeholder: 'Digite a tag' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Adicionar',
          handler: (data) => {
            if (data.tag.trim()) this.tags.push(data.tag.trim());
          }
        }
      ]
    });

    await alert.present();
  }

  removeTag(i: number) {
    this.tags.splice(i, 1);
  }

  /* --------------------- ANEXOS ---------------------- */
  openFilePicker() {
    (document.getElementById('fileInput') as HTMLInputElement).click();
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.attachments.push(...files);
  }

  removeAttachment(i: number) {
    this.attachments.splice(i, 1);
  }

  /* --------------------- SALA ---------------------- */
  async selectRoom() {
    if( !this.userClasses || !Array.isArray(this.userClasses) ) return;
    

    const alert = await this.alertCtrl.create({
      header: 'Selecionar Sala',
      inputs: this.userClasses.map((c) => {
        return {
          name: 'room',
          type: 'radio',
          label: c.title, // Mostra o nome da c
          value: c.id,   // Valor retornado será o ID
          checked: c.id === this.classId // Marca a sala atual
        };
      }),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: data => {
            if(data) this.classId = data;
          }
        }
      ]
    });

    await alert.present();
  }

  /* --------------------- SUBMIT ---------------------- */
  async submit() {
    if (!this.title.trim() || !this.dt_final) {
      alert('Preencha pelo menos título e data limite.');
      return;
    }
    if(!this.classId){
      alert("Escolha a classe para postar a tarefa!");
      return;
    }

    this.isSubmitting = true;

    try {
      const taskData = {
        title: this.title,
        description: this.description,
        classId: this.classId,
        dt_final: this.dt_final,
        tags: this.tags
      }

      console.log("Dados da tarefa: ", taskData);
      await this.contentService.createTask(taskData);

      this.router.navigate(['/class', this.classId]);
    } catch(error){
      alert("Erro ao criar tarefa");
    }
  }
}
