import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassSelectPageRoutingModule } from './class-select-routing.module';

import { ClassSelectPage } from './class-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassSelectPageRoutingModule
  ],
  declarations: [ClassSelectPage]
})
export class ClassSelectPageModule {}
