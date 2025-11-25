import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'src/app/services/taskService/task';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-task-view',
  templateUrl: './task.page.html',
  styleUrls: ['./task.page.scss'],
  standalone: false,
})
export class TaskPage implements OnInit {
  taskId: any;
  tasks: any;
  task: any;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private nav: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.taskId = idParam;

    // if (isNaN(this.taskId)) {
    //   this.presentToast('ID de tarefa inválido.');
    //   this.nav.back();
    //   return;
    // }

    this.loadTask();
  }

  loadTask() {
    this.http.get("assets/task-data.json").subscribe({
      next: (data) => {
        this.tasks = data;
        this.task = this.tasks.find((task: any) => task.id == this.taskId);
      },
      error: (err) => {
        console.error('Erro ao carregar os posts:', err);
      }
    });
    // this.taskService.getAll().subscribe({
    //   next: (res: any) => {
    //     const list = res?.data ?? res ?? [];
    //     this.task = list.find((t: any) => Number(t.id) === Number(this.taskId));

    //     if (!this.task) {
    //       this.presentToast('Tarefa não encontrada.');
    //       this.nav.back();
    //     }
    //   },
    //   error: () => {
    //     this.presentToast('Erro ao carregar tarefa.');
    //     this.nav.back();
    //   }
    // });
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
