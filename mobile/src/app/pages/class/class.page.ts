import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuCriacaoComponent } from 'src/app/components/menu-criacao/menu-criacao.component';
import { HideOnScrollService } from 'src/app/services/hideOnScrollService/hide-on-scroll-service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TagService } from 'src/app/services/tagService/tag';
import { ContentService } from 'src/app/services/contentService/content-service';

@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public selectedTab: string = "";
  public classId!: string | null;
  public tags: any[] = [];
  public classData: any = {
    title: ''
  };

  // BehaviorSubject para notificar filhos sobre as tags selecionadas
  public tagFilter$ = new BehaviorSubject<number[]>([]);

  constructor(
    private contentService: ContentService,
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    public scroll: HideOnScrollService,
    private tagService: TagService
  ) {}

  async ngOnInit() {
    console.log("Route Snapshot: ", this.route.snapshot);
    console.log("ParamMap: ", this.route.snapshot.paramMap);
    console.log("Todos: ", this.route.snapshot.params);
    this.classId = this.route.snapshot.params['id'];

    await this.loadData(this.classId);

    this.selectedTab = this.router.url.split('/')[3];
  }

  async loadData(id: string | null){
    if(!id) return;
    const response = await this.contentService.getClassDetails(id);
    
    this.classData = response;
    console.log(this.classData);
  }

  private loadTags() {
    
  }

  get selectedTags(): number[] {
    return this.tags.filter(t => t.selected).map(t => t.id);
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

  selectTag(id: number) {
    const tag = this.tags.find(t => t.id === id);
    if (!tag) return;

    tag.selected = !tag.selected;

    const tagElement = document.getElementById("tag" + id);
    tagElement?.classList.toggle("selected", tag.selected);

    // Notifica os filhos sobre as tags selecionadas
    this.tagFilter$.next(this.selectedTags);
  }
}
