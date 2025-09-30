import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
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

  @Output() value =  new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  returnValue(event: any) {
    this.value.emit(event.target.value);
  }
}