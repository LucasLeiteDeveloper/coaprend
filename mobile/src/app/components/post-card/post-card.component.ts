import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
})
export class PostCardComponent implements OnInit {
  @Input() post: any;

  constructor() {}

  ngOnInit() {
    console.log('📩 Dados do post recebidos:', this.post);
  }
}
