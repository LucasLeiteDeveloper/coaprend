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
  
  classId!: string | null;

  tags: string[] = [];
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
    
    const response = await this.contentService.getUserClasses();

    console.log("Classes do usuário: ", response)
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
    const alert = await this.alertCtrl.create({
      header: 'Selecionar Sala',
      inputs: [
        { name: 'room', type: 'number', placeholder: 'ID da Sala', value: this.classId   }
      ],
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
      room_id: this.classId ,
      options: this.tags
    };

    this.isSubmitting = true;

    this.taskService.createFormData(payload, this.attachments).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/class', this.classId  ]);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Erro ao criar tarefa.');
      }
    });
  }
}
