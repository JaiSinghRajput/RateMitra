import mongoose, { Schema, Document } from 'mongoose';

export interface IPriceItem extends Document {
  name: string;
  nameHi?: string;
  price: number;
  qty?: number;
  unit?: string;
  isVisible: boolean;
  imageUrl?: string;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

const PriceItemSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    nameHi: { type: String },
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    unit: { type: String, default: 'pcs' },
    isVisible: { type: Boolean, default: true },
    imageUrl: { type: String },
    organizationId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PriceItem || mongoose.model<IPriceItem>('PriceItem', PriceItemSchema);
