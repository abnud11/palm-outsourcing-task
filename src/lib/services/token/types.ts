import type { Token } from '../../models/token';

export enum VisibleTokenStatus {
  ACTIVE = 'Active',
  REVOKED = 'Revoked',
  EXPIRED = 'Expired',
}
export type VisibleToken = Omit<Token, 'status'> & {
  status: VisibleTokenStatus;
  _id: string;
};
