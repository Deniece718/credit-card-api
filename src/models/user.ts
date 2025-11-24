import mongoose, { Document, Schema } from 'mongoose';
import { createHash } from 'crypto';

export interface User extends Document {
  email: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
}

const UserSchema: Schema = new Schema({
  email: { type: 'string', required: true },
  passwordHash: { type: 'string', required: true },
  passwordSalt: { type: 'string', required: true },
});

UserSchema.methods.setPassword = function (password: string) {
  this.passwordHash = createHash('sha256').update(password).digest('hex');

  return;
};

UserSchema.methods.validatePassword = function (password: string) {
  const hash = UserSchema.methods.setPassword(password);

  return this.passwordHash === hash;
};

export default mongoose.model<User>('User', UserSchema);
