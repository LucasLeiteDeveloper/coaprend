import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})

export class ClassPage implements OnInit {
  public selectedTab: string = "";
  public classId: any = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    public scroll: HideOnScrollService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
    this.selectedTab = this.router.url.split('/')[3];
  }

  onSelectClass(id: any) {
    this.classId = id;
    this.router.navigate(['/class', this.classId, 'post']);
  }

  async openCreateNav(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      cssClass: 'menu-criacao-popover',
    });
    await popover.present();
  }
}