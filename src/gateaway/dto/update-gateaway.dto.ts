import { PartialType } from '@nestjs/mapped-types';
import { CreateGateawayDto } from './create-gateaway.dto';

export class UpdateGateawayDto extends PartialType(CreateGateawayDto) {
  id: number;
}
