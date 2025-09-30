import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassPageRoutingModule } from './class-routing.module';

import { ClassPage } from './class.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassPageRoutingModule
  ],
  declarations: [ClassPage]
})
export class ClassPageModule {}
