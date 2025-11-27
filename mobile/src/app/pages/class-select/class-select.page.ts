import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular'; // Adicionei LoadingController
import { ClassService } from 'src/app/services/classService/class';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.page.html',
  styleUrls: ['./class-select.page.scss'],
  standalone: false,
})
export class ClassSelectPage implements OnInit {
  
  public classes: any;

  constructor(
    private alertCtrl: AlertController, // Renomeado para evitar conflito com a propriedade
    private classService: ClassService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private http: HttpClient, // Injeção do LoadingController
  ) {}

  ngOnInit() {
    this.loadClasses();
  }

  // 🔹 Carrega todas as salas do usuário
//   loadClasses() {
// //     this.classService.getMyClasses().subscribe({
// //       next: (res) => {
// //         this.classes = res;
// //       },
// //       error: (err) => {
// //         console.error(err);
// //       }
// //     });
//   }

loadClasses() {
  this.http.get("assets/class-data.json").subscribe({
    next: (data) => {
      this.classes = data;
      console.log('Class carregados:', this.classes);
    },
    error: (err) => {
      console.error('Erro ao carregar class:', err);
    },
  });
}

  // 🔹 Sair da sala
  async exitClassAlert(name: string, id: string) {
    const alert = await this.alertCtrl.create({
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
            this.classService.leaveById(id).subscribe({
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
    const alert = await this.alertCtrl.create({
      header: `Insira o código da sala`,
      inputs: [
        {
          name: 'code',
          placeholder: 'Digite o código...',
          attributes: {
            required: true,
          }
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
          handler: async (data) => {
                const code = data.code?.trim();
                if (!code) return false; // Bloqueia se vazio

                const loading = await this.loadingCtrl.create({
                    message: 'Entrando na sala...'
                });
                await loading.present();

                this.classService.joinByLink(code).subscribe({
                    next: (res) => {
                        loading.dismiss();
                        // 1. Atualizar a lista de salas
                        this.loadClasses();
                        // 2. Navegar para a sala recém-associada.
                        // Assumindo que 'res' é o objeto da sala e contém 'id' ou 'classId'.
                        const classId = res.id || res.classId; 
                        
                        if (classId) {
                            // TODO: Plugar rota real do seu projeto.
                            this.router.navigateByUrl(`/class/${classId}/details`); 
                        } else {
                            this.presentErrorAlert('Sucesso com Alerta', 'Você entrou na sala! (Dados de retorno incompletos)');
                        }
                    },
                    error: (err) => {
                        loading.dismiss();
                        // Tratamento de erro: exibe a mensagem de erro da API.
                        console.error('Erro ao tentar entrar na sala:', err);
                        const errorMessage = err.error?.message || 'Código inválido ou erro de conexão.';
                        this.presentErrorAlert('Erro ao Entrar', errorMessage);
                    }
                });
                return true; // Mantém o alerta aberto até que a chamada termine se o código for válido
            }
        },
      ]
    });

    await alert.present();
  }
    
    // 💡 Função auxiliar para exibir erros (Toast ou Alert)
    async presentErrorAlert(header: string, message: string) {
        const alert = await this.alertCtrl.create({
            header: header,
            message: message,
            buttons: ['OK']
        });
        await alert.present();
    }
}