import { Test, TestingModule } from '@nestjs/testing';
import { GateawayService } from './gateaway.service';

describe('GateawayService', () => {
  let service: GateawayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GateawayService],
    }).compile();

    service = module.get<GateawayService>(GateawayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
