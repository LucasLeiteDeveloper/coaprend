import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService, UserProfile } from 'src/app/services/authService/auth-service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  // receive the user profile data
  @Input() profile: UserProfile = {} as UserProfile;

  public dtBirthdayModel: string = '';
  public isLoading: boolean = false;

  constructor(
    private modalCtrl: ModalController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if(this.profile.dt_birthday){ //converts the dt_birthday
      const dateObj = this.profile.dt_birthday instanceof Date
        ? this.profile.dt_birthday
        : new Date(this.profile.dt_birthday)

      this.dtBirthdayModel = dateObj.toISOString().split('T')[0];
    }
  }

  //save all changes
  async saveChanges(){
    this.isLoading = true;

    try {
      const updates = {
        name: this.profile.name,
        bio: this.profile.bio,
        username: this.profile.username,
        dt_birthday: this.dtBirthdayModel
      }

      await this.authService.updateProfileData(updates);

      // stop the modal and return true to indicate that the update was successfuly
      this.modalCtrl.dismiss(true);
    } catch (error) {
      this.authService.showToast("Erro ao salvar, tente novamente mais tarde");
      this.modalCtrl.dismiss(false); // close with failure
    } finally{ this.isLoading = false; }
  }

  close(){ this.modalCtrl.dismiss() }

}
