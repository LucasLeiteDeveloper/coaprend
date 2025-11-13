import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.page.html',
  styleUrls: ['./create-class.page.scss'],
  standalone: false,
})
export class CreateClassPage {
  className: string = '';
  classDescription: string = '';

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private router: Router
  ) {}

  async createClass() {
    if (!this.className) {
      this.showToast('O nome da turma é obrigatório.');
      return;
    }

    const classData = {
      nome: this.className,
      descricao: this.classDescription,
      criador_id: 1, // depois substitui pelo ID real do usuário logado
    };

    this.http.post('http://localhost:8000/api/classes', classData).subscribe({
      next: async () => {
        await this.showToast('Turma criada com sucesso!');
        this.router.navigate(['/class']);
      },
      error: async (err) => {
        console.error(err);
        await this.showToast('Erro ao criar turma.');
      },
    });
  }

  async showToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}
