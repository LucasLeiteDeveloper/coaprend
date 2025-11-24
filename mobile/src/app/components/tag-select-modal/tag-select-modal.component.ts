import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tag-select-modal',
  templateUrl: './tag-select-modal.component.html',
  styleUrls: ['./tag-select-modal.component.scss'],
  imports: [IonicModule, CommonModule, RouterModule],
})
export class TagSelectModalComponent  implements OnInit {
  
  constructor() { }

  ngOnInit() {}

}
