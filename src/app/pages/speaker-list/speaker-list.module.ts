import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';
import { SafePipe } from '../../pipes/safe.pipe';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SpeakerListPageRoutingModule,
    
  ],
  declarations: [SpeakerListPage,SafePipe],
})
export class SpeakerListModule {}
