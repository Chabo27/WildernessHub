import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { HomeComponent } from './pages/home/home.component';
import { BenefitsComponent } from './components/benefits/benefits.component';
import { CommentsComponent } from './components/comments/comments.component';
import { BrandsComponent } from './components/brands/brands.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    HeroComponent,
    HomeComponent,
    BenefitsComponent,
    CommentsComponent,
    BrandsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ]
})
export class HomeModule {}