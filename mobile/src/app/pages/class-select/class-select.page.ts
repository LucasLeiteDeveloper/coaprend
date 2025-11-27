import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular'; // Adicionei LoadingController
import { ClassService } from 'src/app/services/classService/class';
import { Router } from '@angular/router';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-class-select',
  templateUrl: './class-select.page.html',
  styleUrls: ['./class-select.page.scss'],
  standalone: false,
})
export class ClassSelectPage implements OnInit {
  
  public classes: any[] = [];

  constructor(
    private alertCtrl: AlertController, // Renomeado para evitar conflito com a propriedade
    private classService: ClassService,
    private contentService: ContentService,
    private router: Router,
    private loadingCtrl: LoadingController, // Injeção do LoadingController
  ) {}

  async ngOnInit() {
    await this.loadClasses();
  }

  // 🔹 Carrega todas as salas do usuário
  async loadClasses() {
    const response = await this.contentService.getUserClasses()
                    .then(data => data);

                    console.log(response)
    
    if(response) this.classes = response;
  }

  // 🔹 Sair da sala
  async exitClassAlert(name: string, id: number) {
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

                this.classService.joinClass(code).subscribe({
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