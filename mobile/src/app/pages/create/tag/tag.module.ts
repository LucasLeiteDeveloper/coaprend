import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TagPageRoutingModule } from './tag-routing.module';

import { TagPage } from './tag.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagPageRoutingModule
  ],
  declarations: [TagPage]
})
export class TagPageModule {}
