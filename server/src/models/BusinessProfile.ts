import mongoose, { Schema, Document } from 'mongoose';

export interface IProductService {
  name: string;
  category: string;
  priceRange?: string;
  capacityPerMonth?: string;
  unit?: string;
  description?: string;
}

export interface ILocationDetails {
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  areaType: 'Urban' | 'Semi-Urban' | 'Rural';
  serviceRadiusKm: number;
}

export interface ICapacityDetails {
  monthlyVolume: string;
  unit: string;
  leadTimeDays: number;
  peakCapacity?: string;
  scalabilityNotes?: string;
}

export interface IResourceDetails {
  equipment: string[];
  workspaceType: string;
  workspaceAreaSqFt?: number;
  workforceCount: number;
  hasDeliveryVehicle: boolean;
  rawMaterialAccess?: string;
}

export interface IRegistrations {
  udyam?: string;
  fssai?: string;
  artisanCard?: string;
  gstin?: string;
  pan?: string;
}

export interface IBusinessProfile extends Document {
  userId?: mongoose.Types.ObjectId;
  entrepreneurName: string;
  businessName: string;
  tradeName: string;
  tagline?: string;
  businessType:
    | 'Food Production'
    | 'Tailoring & Apparel'
    | 'Handicrafts & Art'
    | 'Beauty & Wellness'
    | 'Education & Tutoring'
    | 'Repair & Technical'
    | 'Handmade Products'
    | 'Other';
  entityType: string;
  
  // The 6 Core Required Dimensions
  skills: string[];
  productsServices: IProductService[];
  locationDetails: ILocationDetails;
  capacityDetails: ICapacityDetails;
  resourceDetails: IResourceDetails;
  businessGoals: string[];

  // Support & Readiness Metadata
  registrations: IRegistrations;
  turnoverFY: string;
  turnoverValue: number; // in Lakhs
  readinessScore: number; // 0 - 100
  phone?: string;
  email?: string;
  languagesSpoken: string[];
  notes?: string;

  // Legacy compatibility fields
  sector: string;
  location: string;
  district: string;
  state: string;
  udyamStatus: 'Active' | 'Pending' | 'Not Registered';
  udyamRegistrationNo?: string;
  gstin?: string;
  pan?: string;
  employeeCount: number;
  incorporationYear: number;
  complianceHealthScore: number;

  createdAt: Date;
  updatedAt: Date;
}

const ProductServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    priceRange: { type: String, default: '' },
    capacityPerMonth: { type: String, default: '' },
    unit: { type: String, default: 'units' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const LocationDetailsSchema = new Schema(
  {
    address: { type: String, default: '' },
    city: { type: String, default: 'Jaipur' },
    district: { type: String, default: 'Jaipur' },
    state: { type: String, default: 'Rajasthan' },
    pincode: { type: String, default: '302001' },
    areaType: { type: String, enum: ['Urban', 'Semi-Urban', 'Rural'], default: 'Urban' },
    serviceRadiusKm: { type: Number, default: 50 },
  },
  { _id: false }
);

const CapacityDetailsSchema = new Schema(
  {
    monthlyVolume: { type: String, default: '80 kg' },
    unit: { type: String, default: 'kg' },
    leadTimeDays: { type: Number, default: 3 },
    peakCapacity: { type: String, default: '150 kg' },
    scalabilityNotes: { type: String, default: 'Can scale with 2 additional helpers' },
  },
  { _id: false }
);

const ResourceDetailsSchema = new Schema(
  {
    equipment: [{ type: String }],
    workspaceType: { type: String, default: 'Home Kitchen / Workshop' },
    workspaceAreaSqFt: { type: Number, default: 150 },
    workforceCount: { type: Number, default: 2 },
    hasDeliveryVehicle: { type: Boolean, default: false },
    rawMaterialAccess: { type: String, default: 'Local wholesale mandi' },
  },
  { _id: false }
);

const RegistrationsSchema = new Schema(
  {
    udyam: { type: String, default: '' },
    fssai: { type: String, default: '' },
    artisanCard: { type: String, default: '' },
    gstin: { type: String, default: '' },
    pan: { type: String, default: '' },
  },
  { _id: false }
);

const BusinessProfileSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    entrepreneurName: { type: String, required: true, default: 'Sunita Devi' },
    businessName: { type: String, required: true, default: 'Devi Homemade Delights' },
    tradeName: { type: String, default: 'Devi Pickles & Spices' },
    tagline: { type: String, default: 'Traditional sun-dried Rajasthani pickles and organic spices' },
    businessType: {
      type: String,
      enum: [
        'Food Production',
        'Tailoring & Apparel',
        'Handicrafts & Art',
        'Beauty & Wellness',
        'Education & Tutoring',
        'Repair & Technical',
        'Handmade Products',
        'Other',
      ],
      default: 'Food Production',
    },
    entityType: { type: String, default: 'Sole Proprietorship / Home Enterprise' },

    // The 6 Pillars
    skills: {
      type: [String],
      default: ['Traditional Pickle Curing', 'Spice Blending', 'Natural Fermentation', 'Sun-drying', 'Hygienic Preservation'],
    },
    productsServices: {
      type: [ProductServiceSchema],
      default: [
        {
          name: 'Rajasthani Mango Pickle (Aam ka Achar)',
          category: 'Food - Pickles',
          priceRange: '₹280/kg',
          capacityPerMonth: '50 kg',
          unit: 'kg',
          description: 'Authentic mustard oil & fenugreek spiced mango pickle using traditional heirloom recipe',
        },
        {
          name: 'Stuffed Red Chilli Pickle (Banarasi Mirch)',
          category: 'Food - Pickles',
          priceRange: '₹350/kg',
          capacityPerMonth: '30 kg',
          unit: 'kg',
          description: 'Hand-stuffed red chillies with roasted spices',
        },
      ],
    },
    locationDetails: {
      type: LocationDetailsSchema,
      default: () => ({}),
    },
    capacityDetails: {
      type: CapacityDetailsSchema,
      default: () => ({}),
    },
    resourceDetails: {
      type: ResourceDetailsSchema,
      default: () => ({
        equipment: ['Stone mortar & pestle', 'Stainless steel mixing vats', 'Vacuum seal jars', 'Digital weighing scale'],
        workspaceType: 'Dedicated Home Kitchen',
        workspaceAreaSqFt: 180,
        workforceCount: 2,
        hasDeliveryVehicle: false,
        rawMaterialAccess: 'Direct procurement from local spice mandis and organic farmers',
      }),
    },
    businessGoals: {
      type: [String],
      default: [
        'Secure monthly recurring bulk supply orders with 3-5 local cafes, hotels or cloud kitchens',
        'Obtain ₹50,000 - ₹1,00,000 Mudra Shishu/Kishore loan to purchase an electric vacuum sealing & jar labeling machine',
        'Get registered on ONDC (Open Network for Digital Commerce) for direct customer reach',
        'Obtain formal FSSAI Basic Registration & PMFME food processing subsidy assistance',
      ],
    },

    registrations: {
      type: RegistrationsSchema,
      default: () => ({
        udyam: 'UDYAM-RJ-14-0084721',
        fssai: 'Registration in progress',
      }),
    },
    turnoverFY: { type: String, default: 'FY 2025-26' },
    turnoverValue: { type: Number, default: 4.5 }, // 4.5 Lakhs
    readinessScore: { type: Number, default: 82 },
    phone: { type: String, default: '+91 98290 12345' },
    email: { type: String, default: 'sunita.devi@udyamsetu.in' },
    languagesSpoken: { type: [String], default: ['Hindi', 'Marwari', 'Basic English'] },
    notes: { type: String, default: '' },

    // Legacy compatibility fields
    sector: { type: String, default: 'Agri-Processing' },
    location: { type: String, default: 'Malviya Nagar, Jaipur, Rajasthan' },
    district: { type: String, default: 'Jaipur' },
    state: { type: String, default: 'Rajasthan' },
    udyamStatus: { type: String, enum: ['Active', 'Pending', 'Not Registered'], default: 'Active' },
    udyamRegistrationNo: { type: String, default: 'UDYAM-RJ-14-0084721' },
    gstin: { type: String, default: '' },
    pan: { type: String, default: 'ABCDE1234F' },
    employeeCount: { type: Number, default: 2 },
    incorporationYear: { type: Number, default: 2022 },
    complianceHealthScore: { type: Number, default: 85 },
  },
  { timestamps: true }
);

export const BusinessProfile = mongoose.model<IBusinessProfile>('BusinessProfile', BusinessProfileSchema);
