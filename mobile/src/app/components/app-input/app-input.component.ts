import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-input',
  templateUrl: './app-input.component.html',
  styleUrls: ['./app-input.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class AppInputComponent implements OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';

  constructor() {}

  ngOnInit() {}
}