import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public isHidden: boolean = false;
  public postTab: boolean = true;
  public taskTab: boolean = false;
  public calendarTab: boolean = false;
  private lastScrollTop: number = 0;
  public classId: any = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.classId = params.get('id');
    });
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
