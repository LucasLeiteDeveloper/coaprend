import { Injectable } from '@angular/core';
import { ScrollDetail } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class HideOnScrollService {
  public isHidden: boolean = false;
  public lastScrollTop: number = 0;

  onContentScroll(event: CustomEvent<ScrollDetail>) {
    const scrollTop = event.detail.scrollTop;
    if (scrollTop > this.lastScrollTop && scrollTop > 50) {
      if (!this.isHidden) this.isHidden = true;
    }
    else if (scrollTop < this.lastScrollTop || scrollTop === 0) {
       if (this.isHidden) this.isHidden = false;
    }
    this.lastScrollTop = scrollTop;
  }
}
