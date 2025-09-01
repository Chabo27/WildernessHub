import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { PurchaseConfirmationComponent } from './pages/purchase-confirmation/purchase-confirmation.component';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    OrderHistoryComponent,
    PurchaseConfirmationComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ]
})
export class PurchasesModule { }
