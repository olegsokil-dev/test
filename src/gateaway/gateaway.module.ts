import { Module } from '@nestjs/common';
import { GateawayService } from './gateaway.service';
import { Gateaway } from './gateaway';

@Module({
  providers: [Gateaway, GateawayService],
})
export class GateawayModule {}
