import { Component, OnInit } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';
@Component({
  selector: 'app-class',
  templateUrl: './class.page.html',
  styleUrls: ['./class.page.scss'],
  standalone: false,
})
export class ClassPage implements OnInit {
  public isHidden: boolean = false;
  private lastScrollTop: number = 0;
  public classId: number = 0;

  constructor() {}

  ngOnInit() {}
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
