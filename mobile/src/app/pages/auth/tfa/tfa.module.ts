import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TfaPageRoutingModule } from './tfa-routing.module';

import { TfaPage } from './tfa.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TfaPageRoutingModule
  ],
  declarations: [TfaPage]
})
export class TfaPageModule {}
