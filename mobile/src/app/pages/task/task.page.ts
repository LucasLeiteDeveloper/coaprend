import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/taskService/task';
import { NavController, ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-task-view',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {

  taskId!: number;
  task: any = null;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private nav: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskId = idParam ? Number(idParam) : NaN;

    if (isNaN(this.taskId)) {
      this.presentToast('ID de tarefa inválido.');
      this.nav.back();
      return;
    }

    this.loadTask();
  }

  loadTask() {
    this.taskService.getAll().subscribe({
      next: (res: any) => {
        const list = res?.data ?? res ?? [];
        this.task = list.find((t: any) => Number(t.id) === Number(this.taskId));

        if (!this.task) {
          this.presentToast('Tarefa não encontrada.');
          this.nav.back();
        }
      },
      error: () => {
        this.presentToast('Erro ao carregar tarefa.');
        this.nav.back();
      }
    });
  }

  openAttachment(url?: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  async presentToast(msg: string) {
    const t = await this.toastCtrl.create({ message: msg, duration: 2000 });
    await t.present();
  }

  formatDate(date?: string) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}
