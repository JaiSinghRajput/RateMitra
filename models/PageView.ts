import mongoose, { Schema, Document } from 'mongoose';

export interface IPageView extends Document {
  organizationId: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PageViewSchema: Schema = new Schema(
  {
    organizationId: { type: String, required: true, index: true },
    userAgent: { type: String, default: '' },
    ipAddress: { type: String, default: 'unknown' },
  },
  {
    timestamps: true,
  }
);

// Allow hot-reloading in dev
if (mongoose.models.PageView) {
  delete mongoose.models.PageView;
}

export default mongoose.model<IPageView>('PageView', PageViewSchema);
