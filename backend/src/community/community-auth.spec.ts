import { describe, expect, it, vi } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';

const id = '507f1f77bcf86cd799439011';
function setup() {
  const model = { findById: vi.fn().mockResolvedValue({ _id: id }) };
  const jwt = { verifyAsync: vi.fn().mockResolvedValue({ sub: id }) };
  return { service: new AuthService(model as never, jwt as never, {} as never), model, jwt };
}
describe('community account authentication', () => {
  it('looks up the existing account from the verified token', async () => {
    const { service, jwt, model } = setup();
    await expect(service.authenticatedUser('Bearer token')).resolves.toEqual({ _id: id });
    expect(jwt.verifyAsync).toHaveBeenCalledWith('token');
    expect(model.findById).toHaveBeenCalledWith(id);
  });
  it.each([undefined, '', 'Basic token', 'Bearer '])('rejects malformed authorization %s', async header => {
    const { service, model } = setup();
    await expect(service.authenticatedUser(header)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(model.findById).not.toHaveBeenCalled();
  });
  it('rejects expired tokens', async () => {
    const { service, jwt, model } = setup();
    jwt.verifyAsync.mockRejectedValue(new Error('expired'));
    await expect(service.authenticatedUser('Bearer expired')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(model.findById).not.toHaveBeenCalled();
  });
  it('rejects invalid token account IDs', async () => {
    const { service, jwt, model } = setup();
    jwt.verifyAsync.mockResolvedValue({ sub: 'invalid' });
    await expect(service.authenticatedUser('Bearer token')).rejects.toBeInstanceOf(UnauthorizedException);
    expect(model.findById).not.toHaveBeenCalled();
  });
  it('rejects deleted accounts', async () => {
    const { service, model } = setup();
    model.findById.mockResolvedValue(null);
    await expect(service.authenticatedUser('Bearer token')).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
