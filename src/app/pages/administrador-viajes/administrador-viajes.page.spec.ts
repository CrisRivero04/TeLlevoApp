import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministradorViajesPage } from './administrador-viajes.page';

describe('AdministradorViajesPage', () => {
  let component: AdministradorViajesPage;
  let fixture: ComponentFixture<AdministradorViajesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministradorViajesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
