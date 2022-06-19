import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PubFilesComponent } from './pub-files.component';

describe('PubFilesComponent', () => {
  let component: PubFilesComponent;
  let fixture: ComponentFixture<PubFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PubFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PubFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
