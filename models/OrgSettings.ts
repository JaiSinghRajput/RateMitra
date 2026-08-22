import mongoose, { Schema, Document } from 'mongoose';

export interface IOrgSettings extends Document {
  organizationId: string;
  primaryColor: string;
  backgroundColor: string;
  backgroundImage?: string;
  fontColor: string;
  cardBackgroundColor: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrgSettingsSchema: Schema = new Schema(
  {
    organizationId: { type: String, required: true, index: true, unique: true },
    primaryColor: { type: String, default: '#4f46e5' }, // indigo-600
    backgroundColor: { type: String, default: '#f8fafc' }, // slate-50
    backgroundImage: { type: String, default: '' },
    fontColor: { type: String, default: '#1f2937' }, // gray-800
    cardBackgroundColor: { type: String, default: 'rgba(255, 255, 255, 0.8)' }, // translucent white
  },
  {
    timestamps: true,
  }
);

// Allow hot-reloading in dev
if (mongoose.models.OrgSettings) {
  delete mongoose.models.OrgSettings;
}

export default mongoose.model<IOrgSettings>('OrgSettings', OrgSettingsSchema);
