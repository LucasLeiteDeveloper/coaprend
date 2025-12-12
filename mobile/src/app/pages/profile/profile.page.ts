import { Component, OnInit } from '@angular/core';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { ActivatedRoute } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { AuthService, UserProfile } from 'src/app/services/authService/auth-service';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  public classId: any = 0;
  public userPosts: any[] | undefined = [];
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
    private contentService: ContentService,
    private authService: AuthService,
    private popover: PopoverController,
    public scroll: HideOnScrollService,
  ) {}

  async ngOnInit() {
    await this.loadProfileData();
    await this.loadProfilePosts();
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
  async loadProfilePosts(){
    this.isLoading = true;
    console.log("Posts antes do request: ", this.userPosts);

    try {
      const userId = this.profileData.uid;

      if(userId) this.userPosts = await this.contentService.getPostsByUser(userId);
    }catch(error){
      console.error("Erro ao carregar posts: ", error);
      this.authService.showToast("Erro ao carregar posts!");
    }finally {
      this.isLoading = false;
    }

    console.log("Posts depois do request: ", this.userPosts);
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
