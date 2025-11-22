import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/services/classService/class';
import { AlertController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: false,
})
export class ConfigPage implements OnInit {

  classId!: number;
  classData: any;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.classId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadClass();
  }

  loadClass() {
    this.classService.getClassById(this.classId).subscribe(res => {
      this.classData = res;
    });
  }

  // ---------- BÁSICO ----------
  editName() {
    this.router.navigate(['/edit-class-name', this.classId]);
  }

  editPhoto() {
    this.router.navigate(['/edit-class-photo', this.classId]);
  }

  editDescription() {
    this.router.navigate(['/edit-class-description', this.classId]);
  }

  // ---------- ORGANIZAÇÃO ----------
  openTags() {
    this.router.navigate(['/class-tags', this.classId]);
  }

  // ---------- PERMISSÕES ----------
  openUsers() {
    this.router.navigate(['/class-users', this.classId]);
  }

  // ---------- CÓDIGO DE CONVITE ----------
  async showInviteCode() {
    const alert = await this.alertCtrl.create({
      header: 'Código da sala',
      message: `<b>${this.classData?.code}</b>`,
      buttons: [
        {
          text: 'Regenerar',
          handler: () => {
            this.regenerateCode();
          },
        },
        { text: 'Fechar' }
      ]
    });

    await alert.present();
  }

  regenerateCode() {
    this.classService.regenerateCode(this.classId).subscribe(res => {
      this.classData.code = res.code;
      this.showInviteCode();
    });
  }
}
