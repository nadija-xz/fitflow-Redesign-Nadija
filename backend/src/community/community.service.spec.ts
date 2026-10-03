import { describe, expect, it, vi } from 'vitest';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CommunityService } from './community.service.js';

function setup() {
  const user = { _id: new Types.ObjectId(), email: 'member@example.com', name: 'Member' };
  const auth = { authenticatedUser: vi.fn().mockResolvedValue(user) };
  const row = { _id: new Types.ObjectId(), senderId: user._id, senderName: 'Member', text: 'Hello', createdAt: new Date() };
  const query = { sort: vi.fn().mockReturnThis(), limit: vi.fn().mockReturnThis(), exec: vi.fn().mockResolvedValue([row]) };
  const model = { create: vi.fn().mockResolvedValue(row), find: vi.fn().mockReturnValue(query) };
  return { service: new CommunityService(auth as never, model as never), auth, model, query, user, row };
}

describe('shared community chat', () => {
  it('uses the authenticated sender and main group, ignoring supplied identities', async () => {
    const { service, model, user } = setup();
    const result = await service.send('Bearer token', { text: ' Hello ', senderId: 'someone-else', senderName: 'Admin', group: 'private' });
    expect(model.create).toHaveBeenCalledWith({ group: 'main', senderId: user._id, senderName: 'Member', text: 'Hello' });
    expect(result.senderId).toBe(user._id.toString());
  });
  it.each([null, {}, [], { text: '' }, { text: '   ' }, { text: 2 }, { text: 'x'.repeat(1001) }])('rejects invalid messages %j', async body => {
    const { service, model } = setup();
    await expect(service.send('Bearer token', body)).rejects.toBeInstanceOf(BadRequestException);
    expect(model.create).not.toHaveBeenCalled();
  });
  it('rejects unauthenticated reads and writes', async () => {
    const { service, auth, model } = setup();
    auth.authenticatedUser.mockRejectedValue(new UnauthorizedException());
    await expect(service.list(undefined)).rejects.toBeInstanceOf(UnauthorizedException);
    await expect(service.send(undefined, { text: 'Hello' })).rejects.toBeInstanceOf(UnauthorizedException);
    expect(model.create).not.toHaveBeenCalled();
    expect(model.find).not.toHaveBeenCalled();
  });
  it('returns only the shared group and paginates chronologically without exposing user profiles', async () => {
    const { service, query, row, model } = setup();
    const rows = Array.from({ length: 51 }, () => ({ ...row, _id: new Types.ObjectId() })).reverse();
    query.exec.mockResolvedValue(rows);
    const result = await service.list('Bearer token', row._id.toString());
    expect(model.find).toHaveBeenCalledWith({ group: 'main', _id: { $lt: row._id } });
    expect(result.group.name).toBe('Fit Flow Community');
    expect(result.hasMore).toBe(true);
    expect(result.messages).toHaveLength(50);
    expect(result.messages[0].id).toBe(rows[49]._id.toString());
    expect(Object.keys(result.messages[0]).sort()).toEqual(['createdAt', 'id', 'senderId', 'senderName', 'text']);
  });
  it('rejects malformed pagination cursors', async () => {
    const { service, model } = setup();
    await expect(service.list('Bearer token', 'invalid')).rejects.toBeInstanceOf(BadRequestException);
    expect(model.find).not.toHaveBeenCalled();
  });
});
