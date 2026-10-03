import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service.js';

const id = '507f1f77bcf86cd799439011';
const profile = {
  age: 24,
  height: 170,
  weight: 65,
  fitnessGoal: 'build_strength',
};
function setup() {
  const user = {
    _id: id,
    email: 'member@example.com',
    providers: ['local'],
    ...profile,
    onboardingCompleted: true,
  };
  const model = { findByIdAndUpdate: vi.fn().mockResolvedValue(user) };
  const jwt = {
    verifyAsync: vi.fn().mockResolvedValue({ sub: id }),
    signAsync: vi.fn().mockResolvedValue('new-token'),
  };
  const service = new AuthService(model as never, jwt as never, {} as never);
  return { service, model, jwt };
}

describe('profile onboarding', () => {
  it('saves the profile only to the authenticated user and returns completion in the session', async () => {
    const { service, model } = setup();
    const result = await service.completeOnboarding('Bearer valid-token', {
      ...profile,
      userId: 'someone-else',
      providers: ['admin'],
    });
    expect(model.findByIdAndUpdate).toHaveBeenCalledWith(
      id,
      { $set: { ...profile, onboardingCompleted: true } },
      { new: true, runValidators: true },
    );
    expect(result.user).toMatchObject({
      ...profile,
      onboardingCompleted: true,
      id,
    });
    expect(result.accessToken).toBe('new-token');
  });
  it.each([undefined, '', 'Basic token', 'Bearer '])(
    'rejects missing or malformed authorization: %s',
    async (authorization) => {
      const { service, model } = setup();
      await expect(
        service.completeOnboarding(authorization, profile),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
    },
  );
  it('rejects expired tokens before writing anything', async () => {
    const { service, model, jwt } = setup();
    jwt.verifyAsync.mockRejectedValue(new Error('expired'));
    await expect(
      service.completeOnboarding('Bearer expired', profile),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
  });
  it.each([
    null,
    {},
    { ...profile, age: 12 },
    { ...profile, age: 24.5 },
    { ...profile, age: '24' },
    { ...profile, height: 251 },
    { ...profile, weight: 0 },
    { ...profile, weight: Infinity },
    { ...profile, fitnessGoal: 'invalid' },
  ])(
    'rejects invalid profile %j without completing onboarding',
    async (body) => {
      const { service, model } = setup();
      await expect(
        service.completeOnboarding('Bearer valid-token', body),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(model.findByIdAndUpdate).not.toHaveBeenCalled();
    },
  );
  it('rejects an account that no longer exists', async () => {
    const { service, model } = setup();
    model.findByIdAndUpdate.mockResolvedValue(null);
    await expect(
      service.completeOnboarding('Bearer valid-token', profile),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
