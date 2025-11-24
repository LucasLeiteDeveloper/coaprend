import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/taskService/task';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  title = '';
  description = '';
  deadline = '';
  
  roomId!: number;

  tags: string[] = [];
  attachments: File[] = [];

  isSubmitting = false;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('id'));
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
        { name: 'room', type: 'number', placeholder: 'ID da Sala', value: this.roomId }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK',
          handler: data => {
            this.roomId = Number(data.room);
          }
        }
      ]
    });

    await alert.present();
  }

  /* --------------------- SUBMIT ---------------------- */
  submit() {
    if (!this.title.trim() || !this.deadline) {
      alert('Preencha pelo menos título e data limite.');
      return;
    }

    const payload = {
      title: this.title,
      description: this.description,
      deadline: this.deadline,
      room_id: this.roomId,
      options: this.tags
    };

    this.isSubmitting = true;

    this.taskService.createFormData(payload, this.attachments).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/class', this.roomId]);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        alert('Erro ao criar tarefa.');
      }
    });
  }
}
