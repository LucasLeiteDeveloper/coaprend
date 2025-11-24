import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { TagService } from 'src/app/services/tagService/tag';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})

export class ClassPage implements OnInit {
  public selectedTab: string = "";
  public classId: any;
  public tags: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    public scroll: HideOnScrollService,
    public tag: TagService,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
    this.selectedTab = this.router.url.split('/')[3];
    // this.tags = this.tag.getTagsByClass(this.classId);
    this.tags = [
      {
        id: 1,
        icon: "pricetag-outline",
        text: "Oi",
        color: "blue",
        selected: false,
      },
      {
        id: 2,
        icon: "pricetag-outline",
        text: "Oi2",
        color: "red",
        selected: false,
      },
      {
        id: 3,
        icon: "pricetag-outline",
        text: "Oi3",
        color: "yellow",
        selected: false,
      }
    ];
  }
  
  onSelectClass(id: any) {
    this.classId = id;
    this.router.navigate(['/class', this.classId, 'post']);
  }

  onTabChange(tab: string) {
    this.selectedTab = tab;
  }

  async openCreateNav(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuCriacaoComponent,
      event: ev,
      translucent: true,
      animated: false,
      cssClass: 'menu-criacao-popover',
    });
    await popover.present();
  }

  selectTag(id: any) {
    const tagElement = document.getElementById("tag"+id);
    if (!tagElement?.classList.contains('selected')) {
      tagElement?.classList.add("selected");
      this.tags.find((tag: any) => tag.id == id).selected = true;
    } else {
      tagElement?.classList.remove("selected");
      this.tags.find((tag: any) => tag.id == id).selected = false;
    }
  }
}