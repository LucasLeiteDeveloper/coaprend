import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgendaPageRoutingModule } from './agenda-routing.module';

import { AgendaPage } from './agenda.page';
import { CprHeaderComponent } from '../../components/cpr-header/cpr-header.component';
import { CprTaskCardComponent } from '../../components/cpr-task-card/cpr-task-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,
    CprHeaderComponent,
    CprTaskCardComponent,
  ],
  declarations: [AgendaPage],
})
export class AgendaPageModule {}
