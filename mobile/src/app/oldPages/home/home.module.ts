import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';

import { PostCardComponent } from '../../components/post-card/post-card.component';
import { CprHeaderComponent } from '../../components/cpr-header/cpr-header.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    PostCardComponent,
    CprHeaderComponent,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
