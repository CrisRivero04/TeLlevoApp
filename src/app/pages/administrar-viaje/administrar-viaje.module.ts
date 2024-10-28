import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministrarViajePageRoutingModule } from './administrar-viaje-routing.module';

import { AdministrarViajePage } from './administrar-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrarViajePageRoutingModule
  ],
  declarations: [AdministrarViajePage]
})
export class AdministrarViajePageModule {}
