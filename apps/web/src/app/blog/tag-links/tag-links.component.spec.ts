import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagLinksComponent } from './tag-links.component';

describe('TagLinksComponent', () => {
  let component: TagLinksComponent;
  let fixture: ComponentFixture<TagLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TagLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
