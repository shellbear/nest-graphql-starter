import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash password', () => {
    expect(service.hash('password')).toBeDefined();
  });

  it('should compare password', () => {
    expect(service.verify('password', 'password')).resolves.toBe(true);
  });

  it('should fail to compare password', () => {
    expect(service.verify('false', 'true')).resolves.toBe(false);
  });

  it('should hash and compare password', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);

    expect(service.verify(password, hashedPassword)).resolves.toBe(true);
  });
});
