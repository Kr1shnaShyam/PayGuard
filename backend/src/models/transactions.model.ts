import { Schema, model, Document, Types } from 'mongoose';

export type TransactionStatus =
  | 'PENDING_PAYMENT'
  | 'ESCROWED'
  | 'SHIPPED'
  | 'COMPLETED';

export interface ITransaction extends Document {
  orderId: string;
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  items: Array<{ sku: string; name: string; qty: number; unitPrice: number }>;
  amount: number;
  currency: string;
  status: TransactionStatus;
  escrow?: {
    escrowId?: string;
    heldAt?: Date;
    releasedAt?: Date;
  };
  history: Array<{ status: TransactionStatus; ts: Date; by?: Types.ObjectId }>;
}

const TransactionSchema = new Schema<ITransaction>({
  orderId: { type: String, required: true },
  buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ sku: String, name: String, qty: Number, unitPrice: Number }],
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, default: 'PENDING_PAYMENT' },
  escrow: { type: Schema.Types.Mixed },
  history: [{ status: String, ts: Date, by: Schema.Types.ObjectId }]
}, { timestamps: true });

export default model<ITransaction>('Transaction', TransactionSchema);
