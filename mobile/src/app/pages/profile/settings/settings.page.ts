import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService, UserProfile } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  paletteToggle = false;
  userProfile!: UserProfile;

  constructor(
    public actionConfirm: ActionSheetController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    // Use matchMedia to check the user preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Initialize the dark palette based on the initial
    // value of the prefers-color-scheme media query
    this.initializeDarkPalette(prefersDark.matches);

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addEventListener('change', (mediaQuery) => this.initializeDarkPalette(mediaQuery.matches));

    await this.loadUserProfile();
  }
  async loadUserProfile() {
    try {
      this.userProfile = await this.authService.getProfileData();
      console.log("Dados do usuário: ", this.userProfile);
    } catch(error){
      console.error("Erro ao carregar: ", error);
    }
  }

  // Check/uncheck the toggle and update the palette based on isDark
  initializeDarkPalette(isDark: boolean) {
    this.paletteToggle = isDark;
    this.toggleDarkPalette(isDark);
  }

  // Listen for the toggle check/uncheck to toggle the dark palette
  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
  }

  async canDismissLogout() {
    const actionSheet = await this.actionConfirm.create({
      header: 'Deseja mesmo sair?',
      buttons: [
        {
          text: 'Sim',
          role: 'confirm',
          handler: async () => {
            localStorage.removeItem("classId");
            await this.authService.logout();
          }
        },
        {
          text: 'Não',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  async canDismissDelete() {
    const actionSheet = await this.actionConfirm.create({
      header: 'Deseja mesmo apagar sua conta?',
      buttons: [
        {
          text: 'Sim',
          role: 'confirm',
          handler: async () => {
            localStorage.removeItem("classId")
            await this.authService.deleteAccount();
          }
        },
        {
          text: 'Não',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };

  // the update's name alert config
  async openNameAlert() {
    const alert = await this.alertController.create({
      header: "Editar nome",
      subHeader: "Como você gostaria de ser chamado(a)?",
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Digite seu novo nome',
          value: this.userProfile?.name || '',
          attributes: {
            maxlength: 50,
            minlength: 2
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Salvar',
          handler: async (data) => {
            if(data.name && data.name.trim()) {
              await this.updateName(data.name)
              return true;
            } else {
              this.authService.showToast("O nome precisa estar preenchido corretamente");
              return false
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async updateName(name: string) {
    if(name === this.userProfile?.name) {
      this.authService.showToast("O nome é o mesmo!");
      return;
    }

    // validate the name
    if(name.length < 2) {
      this.authService.showToast("O nome deve ter pelo menos 2 caracteres");
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Atualizando nome...',
      spinner: 'crescent'
    });

    await loading.present();

    try {
      await this.authService.updateProfileData({ name: name });

      this.userProfile.name = name;

      this.authService.showToast("Nome atualizado com sucesso!");
    } catch (error: any) {
      console.error('Erro ao atualizar nome:', error);
      
      // Mensagens de erro mais específicas
      if (error.error && error.error.error) {
        this.authService.showToast(error.error.error);
      } else {
        this.authService.showToast('Erro ao atualizar nome. Tente novamente.');
      }
    } finally {
      await loading.dismiss();
    }
  }
}
