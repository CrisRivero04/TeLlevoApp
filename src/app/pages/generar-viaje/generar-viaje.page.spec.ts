import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarViajePage } from './generar-viaje.page';

describe('GenerarViajePage', () => {
  let component: GenerarViajePage;
  let fixture: ComponentFixture<GenerarViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
