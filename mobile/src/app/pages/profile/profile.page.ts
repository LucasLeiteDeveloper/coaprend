import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserProfile } from '../../services/authService/auth-service';
import { AuthService } from 'src/app/services/authService/auth-service';
=======
import { ScrollDetail } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
>>>>>>> 0a71926a0d97d5157d86a40f16c3b65933028b50

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
<<<<<<< HEAD
  // initialize the profileData
  profileData: UserProfile | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController
  ) {}

  ngOnInit() { this.loadProfile() }

  //get the profile data on init
  async loadProfile(){
    try {
      this.profileData = await this.authService.getProfileData();
    } catch(error){
      console.error("Erro ao carregar perfil: ", error);
    }
  }

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
=======
  public isHidden: boolean = false;
  public postTab: boolean = true;
  public taskTab: boolean = false;
  public calendarTab: boolean = false;
  private lastScrollTop: number = 0;
  public classId: any = 0;
  public postExample: {} = {
    title: 'Post de teste',
    author: 'Usuário de teste',
    items: [{ content: 'Conteudo de teste' }],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
  }
  onContentScroll(event: CustomEvent<ScrollDetail>) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      if (!this.isHidden) {
        this.isHidden = true;
      }
    } else if (scrollTop < this.lastScrollTop || scrollTop === 0) {
      if (this.isHidden) {
        this.isHidden = false;
      }
    }
    this.lastScrollTop = scrollTop;
>>>>>>> 0a71926a0d97d5157d86a40f16c3b65933028b50
  }
}
