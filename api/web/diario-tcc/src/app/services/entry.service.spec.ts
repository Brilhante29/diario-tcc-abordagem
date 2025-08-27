import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EntryService } from './entry.service';

describe('EntryService', () => {
  let service: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
