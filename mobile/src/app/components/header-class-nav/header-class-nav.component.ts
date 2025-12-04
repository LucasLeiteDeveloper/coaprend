import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header-class-nav',
  templateUrl: './header-class-nav.component.html',
  styleUrls: ['./header-class-nav.component.scss'],
  imports: [IonicModule, RouterModule]
})
export class HeaderClassNavComponent {
  @Input() classId!: string;
  @Input() selectedTab!: string;

  onTabChange(tab: string) {
    this.selectedTab = tab;
  }
}