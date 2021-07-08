import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PublicRoutingModule } from './public-routing.module';
import { RegistroDonadorComponent } from './registro-donador/registro-donador.component';


@NgModule({
  declarations: [RegistroDonadorComponent],
  imports: [
    CommonModule,
    SharedModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
