import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroViajePage } from './registro-viaje.page';

describe('RegistroViajePage', () => {
  let component: RegistroViajePage;
  let fixture: ComponentFixture<RegistroViajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroViajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
