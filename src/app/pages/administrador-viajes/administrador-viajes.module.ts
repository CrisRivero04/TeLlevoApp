import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdministradorViajesPageRoutingModule } from './administrador-viajes-routing.module';

import { AdministradorViajesPage } from './administrador-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministradorViajesPageRoutingModule
  ],
  declarations: [AdministradorViajesPage]
})
export class AdministradorViajesPageModule {}
