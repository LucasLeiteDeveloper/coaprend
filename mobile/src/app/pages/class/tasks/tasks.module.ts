import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';

import { TasksPage } from './tasks.page';
import { ClassSelectorComponent } from 'src/app/components/class-selector/class-selector.component';
import { PostCardComponent } from 'src/app/components/post-card/post-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksPageRoutingModule,
    ClassSelectorComponent,
    PostCardComponent,
  ],
  declarations: [TasksPage]
})
export class TasksPageModule {}
