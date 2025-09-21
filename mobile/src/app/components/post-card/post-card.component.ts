import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class PostCardComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
