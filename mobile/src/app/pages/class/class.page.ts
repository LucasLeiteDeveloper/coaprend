import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
  public selectedTab!: string;
  public classId!: number;
  public tags: any;
  public tagFilter$ = new BehaviorSubject<number[]>([]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private popoverCtrl: PopoverController,
    public scroll: HideOnScrollService,
    private tagService: TagService,
    private http: HttpClient,
  ) {}

  ngOnInit() {
    this.selectedTab = this.router.url.split('/')[3];
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (!idParam) return;
      this.classId = Number(idParam);
      this.loadTags();
    });
  }

  private loadTags() {
    this.http.get<ClassData[]>("assets/class-data.json").subscribe({
      next: (data: ClassData[]) => {
        this.tags = data[this.classId].tags;
      },

      error: (err) => {console.error('Tag loading error:', err)}
    });
  }

  private get selectedTags(): number[] {
    return this.tags.find((tag: any) => tag.selected).find((tag: any) => tag.id);
  }

  public async openCreateNav(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: MenuCriacaoComponent,
      event: ev,
      animated: false,
    });
    await popover.present();
  }

  public selectTag(element: any, id: number) {
    const tagObject = this.tags.find((tag: { id: number }) => tag.id === id);
    const tagElement = element;

    if (!tagObject || !tagElement) return;
    
    tagObject.selected = !tagObject.selected;
    tagElement?.classList.toggle("selected", tagObject.selected);

    this.tagFilter$.next(this.selectedTags);
  }
}

interface ClassData {
  id?: number;
  name?: string;
  tags: [];
}
