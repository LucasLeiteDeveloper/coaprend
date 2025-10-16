import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class TaskCardComponent implements OnInit {
  @Input() task: any;

  constructor() {}

  ngOnInit() {}
}
