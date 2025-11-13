import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserProfile } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
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

  // user's data
  public profileData!: UserProfile;
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService) {}

  async ngOnInit() {
    await this.loadProfileData();

    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
  }

  async loadProfileData(){
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
  }
}
