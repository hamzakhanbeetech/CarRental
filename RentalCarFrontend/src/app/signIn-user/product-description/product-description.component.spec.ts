import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductDescriptionComponent } from './product-description.component';

describe('ProductDescriptionComponent', () => {
  let component: UserProductDescriptionComponent;
  let fixture: ComponentFixture<UserProductDescriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProductDescriptionComponent]
    });
    fixture = TestBed.createComponent(UserProductDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
