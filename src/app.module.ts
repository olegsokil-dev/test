import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GateawayModule } from './gateaway/gateaway.module';

@Module({
  imports: [GateawayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
