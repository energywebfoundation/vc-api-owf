import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CredoService } from './credo.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CredoService],
  exports: [CredoService]
})
export class CredoModule {}
