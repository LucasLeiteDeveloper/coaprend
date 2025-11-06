import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  //pop-up to confirm the logout
  async confirmLogout(){
    const alert = await this.alertController.create({
      header: "Deseja sair da conta?",
      message: "Você tem certeza? Para entrar novamente precisará fazer log-in novamente",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Excluir",
          cssClass: 'alert-button-danger',
          handler: ()=> {
            this.authService.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  // pop-up to confirm the delete
  async confirmDeleteAccount(){
    const alert = await this.alertController.create({
      header: "Excluir conta?",
      message: "Você tem certeza? Seus dados serão perdidos permanentemente",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel"
        },
        {
          text: "Excluir",
          cssClass: 'alert-button-danger',
          handler: ()=> {
            this.handleDeleteAccount();
          }
        }
      ]
    });

    await alert.present();
  }

  //calls the service to delete the account
  private async handleDeleteAccount(){
    try {
      await this.authService.deleteAccount();

      this.router.navigate(['/login'])
    } catch( error ){
      console.error("Erro ao excluir conta: ", error);
      this.presentAlert("Erro", "Não foi possível excluir a conta. Tente novamente mais tarde");
    }
  }

  // helper to alert error
  async presentAlert(header: string, message: string){
    const alert = await this.alertController.create({
      header,
      message, 
      buttons: ['OK']
    });


    await alert.present();
  }
}
