import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGroups } from './student-groups';

describe('StudentGroups', () => {
  let component: StudentGroups;
  let fixture: ComponentFixture<StudentGroups>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentGroups]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentGroups);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
