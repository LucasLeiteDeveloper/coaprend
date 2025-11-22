import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ClassService } from 'src/app/services/classService/class';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.page.html',
  styleUrls: ['./class-select.page.scss'],
  standalone: false,
})
export class ClassSelectPage implements OnInit {
  
  public classes: any[] = [];

  constructor(
    private alert: AlertController,
    private classService: ClassService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  // 🔹 Carrega todas as salas do usuário
  loadClasses() {
    this.classService.getMyClasses().subscribe({
      next: (res) => {
        this.classes = res;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // 🔹 Sair da sala
  async exitClassAlert(name: string, id: number) {
    const alert = await this.alert.create({
      header: `Deseja sair de ${name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: () => {
            this.classService.leaveClass(id).subscribe({
              next: () => this.loadClasses(),
              error: (err) => console.error(err)
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // 🔹 Entrar na sala via código
  async enterClassAlert() {
    const alert = await this.alert.create({
      header: `Insira o código da sala`,
      inputs: [
        {
          name: 'code',
          placeholder: 'Digite o código...',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          role: 'confirm',
          handler: (data) => {
            const code = data.code?.trim();
            if (!code) return;

            this.classService.joinClass(code).subscribe({
              next: () => this.loadClasses(),
              error: (err) => console.error(err)
            });
          }
        },
      ]
    });

    await alert.present();
  }
}
