import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroViajePageRoutingModule } from './registro-viaje-routing.module';

import { RegistroViajePage } from './registro-viaje.page';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroViajePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistroViajePage]
})
export class RegistroViajePageModule {}
