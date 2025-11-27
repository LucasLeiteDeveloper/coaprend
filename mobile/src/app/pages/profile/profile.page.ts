import { Component, OnInit } from '@angular/core';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { AuthService, UserProfile } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  public classId: any = 0;
  public postExample: {} = {
    title: 'Post de teste',
    author: 'Usuário de teste',
    items: [{ content: 'Conteudo de teste' }],
  };

  public isLoading: boolean = false;
  public profileData: UserProfile = {
    name: '',
    email: ''
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private popover: PopoverController,
    public scroll: HideOnScrollService,
  ) {}

  async ngOnInit() {
    await this.loadProfileData();
    console.log(this.profileData);

    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
  }

  async loadProfileData() {
    this.isLoading = true;

    try {
      this.profileData = await this.authService.getProfileData();
    } catch(error){
      console.error("Erro ao carregar perfil: ", error);

      this.authService.showToast('Erro ao carregar o perfil!');
    } finally {
      this.isLoading = false;
    }
  }

  async openCreateNav(ev: any) {
    const popover = await this.popover.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      animated: false,
      cssClass: 'menu-criacao-popover',
    });
    await popover.present();
  }
}
