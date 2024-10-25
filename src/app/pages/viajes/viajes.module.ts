import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajesPageRoutingModule } from './viajes-routing.module';

import { ViajesPage } from './viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ViajesPageRoutingModule
  ],
  declarations: [ViajesPage]
})
export class ViajesPageModule {}
