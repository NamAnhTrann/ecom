import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPage } from './forum-page';

describe('ForumPage', () => {
  let component: ForumPage;
  let fixture: ComponentFixture<ForumPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForumPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
