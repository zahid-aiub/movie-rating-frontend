import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationOtfComponent } from './activation-otf.component';

describe('ActivationOtfComponent', () => {
  let component: ActivationOtfComponent;
  let fixture: ComponentFixture<ActivationOtfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivationOtfComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationOtfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
