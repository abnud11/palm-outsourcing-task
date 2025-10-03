import mongoose, { Schema } from 'mongoose';

export enum TokenStatus {
  ACTIVE = 'active',
  REVOKED = 'revoked',
}

export interface Token {
  service: string;
  token: string;
  expiryDate: Date | string;
  status: TokenStatus;
}

const TokenSchema = new Schema<Token>(
  {
    service: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expiryDate: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(TokenStatus),
      default: TokenStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

export const TokenModel =
  (mongoose.models.Token as mongoose.Model<Token>) ||
  mongoose.model<Token>('Token', TokenSchema);
