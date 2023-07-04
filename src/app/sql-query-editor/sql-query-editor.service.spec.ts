import { TestBed } from '@angular/core/testing';

import { SqlQueryEditorService } from './sql-query-editor.service';

describe('SqlQueryEditorService', () => {
  let service: SqlQueryEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlQueryEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
