import { hash } from 'bcrypt';

export async function hashPassword(plainPassword: string): Promise<string> {
  return await hash(plainPassword, 10);
}
