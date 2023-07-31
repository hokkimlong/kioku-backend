import { hash, compare } from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<string> {
  return await hash(plainPassword, 10);
}

export async function verifyPassword(plainPassword: string, hashPassword: string): Promise<boolean> {
  return await compare(plainPassword, hashPassword);
}