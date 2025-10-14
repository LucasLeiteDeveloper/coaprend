import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ClassPageRoutingModule } from './class-routing.module';
import { ClassPage } from './class.page';
import { ClassSelectorComponent } from 'src/app/components/class-selector/class-selector.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassPageRoutingModule,
    ClassSelectorComponent,
  ],
  declarations: [ClassPage]
})
export class ClassPageModule {}
