import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivationOtfListComponent } from './activation-otf-list.component';

describe('ActivationOtfListComponent', () => {
  let component: ActivationOtfListComponent;
  let fixture: ComponentFixture<ActivationOtfListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivationOtfListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivationOtfListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
