import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { OrderComponent } from './order/order.component';
import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { ProducersComponent } from './producers/producers.component';
import { ProducerFormComponent } from './producer-form/producer-form.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TypesComponent } from './types/types/types.component';
import { TypeFormComponent } from './types/type-form/type-form.component';


@NgModule({
  declarations: [
    AdminComponent,
    OrderComponent,
    ProductsComponent,
    ProductFormComponent,
    ProducersComponent,
    ProducerFormComponent,
    AdminDashboardComponent,
    TypesComponent,
    TypeFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
