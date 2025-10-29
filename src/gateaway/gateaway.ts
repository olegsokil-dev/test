import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import {
  modPow,
  getPrimeNumber,
  generateRandomNumber,
  findPrimitiveRoot,
  generateMultiplePrimes,
} from '../../helpers/generateRandomNumber';

interface SessionData {
  primeNumber: number;
  alpha: number;
  secretKey: number;
  publicKey: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class Gateaway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('DiffieHellmanGateway');

  private sessions = new Map<string, SessionData>();

  handleConnection(client: Socket) {
    this.logger.log(`✅ Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.sessions.delete(client.id);
  }

  @SubscribeMessage('initiateDH')
  initiateDiffieHellman(@ConnectedSocket() client: Socket) {
    const result = getPrimeNumber();
    const { primeNumber, attempts, failedNumbers } = result;

    const alpha = findPrimitiveRoot(primeNumber);

    const secretKey = generateRandomNumber(2, primeNumber - 2);

    const publicKey = modPow(alpha, secretKey, primeNumber);

    this.sessions.set(client.id, {
      primeNumber,
      alpha,
      secretKey,
      publicKey,
    });

    this.logger.log(
      `Generated DH params: p=${primeNumber}, α=${alpha} (primitive root), attempts=${attempts}`,
    );

    if (failedNumbers.length > 0) {
      this.logger.log('❌ Числа, що не пройшли тест Ферма:');
      failedNumbers.forEach((failed) => {
        this.logger.log(`   ${failed.number} - ${failed.reason}`);
      });
    }

    client.emit('dhParameters', {
      primeNumber,
      alpha,
      publicKey,
      attempts,
      failedNumbers,
      message: 'Public params were sent',
    });
  }

  @SubscribeMessage('sendPublicKeyB')
  receivePublicKeyB(
    @MessageBody() data: { publicKeyB: number },
    @ConnectedSocket() client: Socket,
  ) {
    const session = this.sessions.get(client.id);

    if (!session) {
      this.logger.error('❌ Error, session is not found!');
      client.emit('error', {
        message: 'Error, session is not found!',
      });
      return;
    }

    const { publicKeyB } = data;

    const sharedSecretA = modPow(
      publicKeyB,
      session.secretKey,
      session.primeNumber,
    );

    this.logger.log(
      `Computed shared secret A: K_AB = ${sharedSecretA} from Y_B=${publicKeyB}`,
    );

    client.emit('sharedSecretComputed', {
      message: 'Shared key successfully sent!',
      sharedSecret: sharedSecretA,
      details: {
        primeNumber: session.primeNumber,
        alpha: session.alpha,
        publicKeyA: session.publicKey,
        publicKeyB: publicKeyB,
      },
    });
  }

  @SubscribeMessage('generate10Primes')
  generate10Primes(@ConnectedSocket() client: Socket) {
    this.logger.log('🔢 Generating 10 prime numbers...');

    const result = generateMultiplePrimes(10);

    this.logger.log(
      `✅ Generated 10 primes. Average attempts: ${result.averageAttempts.toFixed(2)}`,
    );

    if (result.failedNumbers.length > 0) {
      this.logger.log('📋 Приклади чисел, що не пройшли тест Ферма:');
      result.failedNumbers.forEach((item) => {
        this.logger.log(`   Для простого #${item.primeIndex}:`);
        item.failures.forEach((failed) => {
          this.logger.log(`      ${failed.number} - ${failed.reason}`);
        });
      });
    }

    client.emit('primes10Result', {
      primes: result.primes,
      attempts: result.attempts,
      averageAttempts: result.averageAttempts,
      totalAttempts: result.totalAttempts,
      failedNumbers: result.failedNumbers,
    });
  }
}
