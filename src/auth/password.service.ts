import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import * as crypto from 'crypto';
import { nanoid } from 'nanoid';

@Injectable()
export class PasswordService {
  verify(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hash(password: string): Promise<string> {
    return hash(password, 10);
  }

  hash256(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  generateToken(size = 32): string {
    return nanoid(size);
  }
}
