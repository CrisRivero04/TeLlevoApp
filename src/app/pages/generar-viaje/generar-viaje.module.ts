import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerarViajePageRoutingModule } from './generar-viaje-routing.module';

import { GenerarViajePage } from './generar-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerarViajePageRoutingModule
  ],
  declarations: [GenerarViajePage]
})
export class GenerarViajePageModule {}
