import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }]
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });
});
