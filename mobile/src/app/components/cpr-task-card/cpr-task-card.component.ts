import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'cpr-task-card',
  templateUrl: './cpr-task-card.component.html',
  styleUrls: ['./cpr-task-card.component.scss'],
  imports: [IonicModule, CommonModule],
})
export class CprTaskCardComponent implements OnInit {
  @Input() post: any;

  constructor() {}

  ngOnInit() {}
}
