import mongoose, { Schema, Document } from 'mongoose';

export type OpportunityType =
  | 'customer'
  | 'business'
  | 'bulk_order'
  | 'partnership'
  | 'marketplace'
  | 'financing'
  | 'government_scheme'
  | 'support_program';

export interface IOpportunity extends Document {
  title: string;
  type: OpportunityType;
  category: string; // e.g. 'Food Production', 'Tailoring & Apparel', 'Handicrafts & Art', 'All'
  organization: string; // e.g. "Chokhi Dhani Heritage Resort", "Ministry of MSME", "ONDC Network"
  description: string;
  locationScope: {
    state?: string;
    city?: string;
    isPanIndia: boolean;
    serviceRadiusKm?: number;
  };
  estimatedValue: string; // e.g. "₹45,000 / month", "Up to ₹3,00,000 subsidy"
  capacityNeeded?: string;
  requiredSkills: string[];
  eligibleCategories: string[];
  eligibilityCriteria: string[];
  keyBenefits: string[];
  deadline?: string;
  actionLabel: string; // e.g. "Send B2B Pitch", "Apply for Scheme", "Connect on ONDC", "Join Pod"
  officialUrl?: string;
  contactPerson?: string;
  contactEmailOrPhone?: string;
  tags: string[];
  partnershipType?: 'production_pooling' | 'raw_material_group' | 'cross_selling' | 'shared_logistics';
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'customer',
        'business',
        'bulk_order',
        'partnership',
        'marketplace',
        'financing',
        'government_scheme',
        'support_program',
      ],
      required: true,
    },
    category: { type: String, required: true },
    organization: { type: String, required: true },
    description: { type: String, required: true },
    locationScope: {
      state: { type: String, default: '' },
      city: { type: String, default: '' },
      isPanIndia: { type: Boolean, default: true },
      serviceRadiusKm: { type: Number, default: 0 },
    },
    estimatedValue: { type: String, required: true },
    capacityNeeded: { type: String, default: '' },
    requiredSkills: [{ type: String }],
    eligibleCategories: [{ type: String }],
    eligibilityCriteria: [{ type: String }],
    keyBenefits: [{ type: String }],
    deadline: { type: String, default: '' },
    actionLabel: { type: String, default: 'View & Connect' },
    officialUrl: { type: String, default: '' },
    contactPerson: { type: String, default: '' },
    contactEmailOrPhone: { type: String, default: '' },
    tags: [{ type: String }],
    partnershipType: {
      type: String,
      enum: ['production_pooling', 'raw_material_group', 'cross_selling', 'shared_logistics'],
    },
  },
  { timestamps: true }
);

export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
