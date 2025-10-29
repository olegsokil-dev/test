import { Test, TestingModule } from '@nestjs/testing';
import { GateawayGateway } from 'src/gateaway/gateaway';
import { GateawayService } from './gateaway.service';

describe('GateawayGateway', () => {
  let gateway: GateawayGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GateawayGateway, GateawayService],
    }).compile();

    gateway = module.get<GateawayGateway>(GateawayGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
