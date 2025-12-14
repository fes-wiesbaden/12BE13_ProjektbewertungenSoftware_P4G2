import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherAssessmentResults } from './teacher-assessment-results';

describe('TeacherAssessmentResults', () => {
  let component: TeacherAssessmentResults;
  let fixture: ComponentFixture<TeacherAssessmentResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherAssessmentResults]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherAssessmentResults);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
