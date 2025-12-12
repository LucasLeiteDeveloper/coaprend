import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header-class-page',
  templateUrl: './header-class-page.component.html',
  styleUrls: ['./header-class-page.component.scss'],
  standalone: true,
  imports: [IonicModule, RouterModule]
})

export class HeaderClassPageComponent {
  @Input() className!: string;
}