import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'cpr-header',
  templateUrl: './cpr-header.component.html',
  styleUrls: ['./cpr-header.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})

export class CprHeaderComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
