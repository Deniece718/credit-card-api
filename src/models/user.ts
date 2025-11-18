import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

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
  this.passwordSalt = crypto.randomBytes(16).toString('hex');

  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512')
    .toString('hex');

  return;
};

UserSchema.methods.validatePassword = function (password: string) {
  const hash = crypto.pbkdf2Sync(password, this.passwordSalt, 1000, 64, 'sha512').toString('hex');

  return this.passwordHash === hash;
};

export default mongoose.model<User>('User', UserSchema);
