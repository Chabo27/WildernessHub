import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarticaPlacanjeComponent } from './kartica-placanje.component';

describe('KarticaPlacanjeComponent', () => {
  let component: KarticaPlacanjeComponent;
  let fixture: ComponentFixture<KarticaPlacanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KarticaPlacanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarticaPlacanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
