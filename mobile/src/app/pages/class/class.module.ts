import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ClassPageRoutingModule } from './class-routing.module';
import { ClassPage } from './class.page';

import { FooterNavComponent } from 'src/app/components/footer-nav/footer-nav.component';
import { HeaderClassPageComponent } from 'src/app/components/header-class-page/header-class-page.component';
import { HeaderClassNavComponent } from 'src/app/components/header-class-nav/header-class-nav.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassPageRoutingModule,
    FooterNavComponent,
    HeaderClassPageComponent,
    HeaderClassNavComponent
  ],
  declarations: [ClassPage]
})
export class ClassPageModule {}
