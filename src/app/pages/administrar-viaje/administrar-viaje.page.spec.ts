import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrarViajePage } from './administrar-viaje.page';

describe('AdministrarViajePage', () => {
  let component: AdministrarViajePage;
  let fixture: ComponentFixture<AdministrarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
