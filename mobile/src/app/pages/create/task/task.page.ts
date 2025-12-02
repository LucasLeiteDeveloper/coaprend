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
  dt_final = '';
  
  roomId!: string | null;

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
      inputs: this.userClasses.map((classe, index) => {
        return {
          name: 'room',
          type: 'radio',
          label: classe.title, // Mostra o nome da classe
          value: classe.id,   // Valor retornado será o ID
          checked: classe.id === this.roomId // Marca a sala atual
        };
      }),
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: data => {
            
          }
        }
      ]
    });

    await alert.present();
  }

  /* --------------------- SUBMIT ---------------------- */
  submit() {
    if (!this.title.trim() || !this.dt_final) {
      alert('Preencha pelo menos título e data limite.');
      return;
    }

    const payload = {
      title: this.title,
      description: this.description,
      dt_final: this.dt_final,
      room_id: this.roomId ,
      options: this.tags
    };

    this.isSubmitting = true;

    this.taskService.createFormData(payload, this.attachments).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/class', this.roomId  ]);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Erro ao criar tarefa.');
      }
    });
  }
}
