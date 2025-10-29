import { Injectable } from '@nestjs/common';
import { CreateGateawayDto } from './dto/create-gateaway.dto';
import { UpdateGateawayDto } from './dto/update-gateaway.dto';

@Injectable()
export class GateawayService {
  create(createGateawayDto: CreateGateawayDto) {
    return 'This action adds a new gateaway';
  }

  findAll() {
    return `This action returns all gateaway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gateaway`;
  }

  update(id: number, updateGateawayDto: UpdateGateawayDto) {
    return `This action updates a #${id} gateaway`;
  }

  remove(id: number) {
    return `This action removes a #${id} gateaway`;
  }
}
