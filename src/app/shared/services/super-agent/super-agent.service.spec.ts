import { TestBed } from '@angular/core/testing';

import { SuperAgentService } from './super-agent.service';

describe('SuperAgentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SuperAgentService = TestBed.get(SuperAgentService);
    expect(service).toBeTruthy();
  });
});
