import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateClassPageRoutingModule } from './create-class-routing.module';

import { CreateClassPage } from './create-class.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateClassPageRoutingModule
  ],
  declarations: [CreateClassPage]
})
export class CreateClassPageModule {}
