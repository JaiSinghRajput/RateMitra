import mongoose, { Schema, Document } from 'mongoose';

export interface IActionLog extends Document {
  organizationId: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  itemName: string;
  details?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ActionLogSchema: Schema = new Schema(
  {
    organizationId: { type: String, required: true, index: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    action: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE'], required: true },
    itemName: { type: String, required: true },
    details: { type: String },
  },
  {
    timestamps: true,
  }
);

// Allow hot-reloading in dev
if (mongoose.models.ActionLog) {
  delete mongoose.models.ActionLog;
}

export default mongoose.model<IActionLog>('ActionLog', ActionLogSchema);
