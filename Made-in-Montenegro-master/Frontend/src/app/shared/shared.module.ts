import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { Navbar2Component } from './components/navbar2/navbar2.component'; 




@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    Navbar2Component
  ],
  imports: [
    CommonModule,
     RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    Navbar2Component
  ]
})
export class SharedModule { }
