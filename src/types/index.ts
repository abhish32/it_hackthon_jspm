export type ComplianceStatus =
  | "active"
  | "verified"
  | "pending"
  | "due_soon"
  | "overdue"
  | "critical";

export type PriorityLevel = "critical" | "high" | "medium" | "low";

export type SectorType =
  | "Manufacturing"
  | "Services"
  | "Retail & Wholesale"
  | "Textiles"
  | "Agri-Processing"
  | "Technology";

export type BusinessType =
  | "Food Production"
  | "Tailoring & Apparel"
  | "Handicrafts & Art"
  | "Beauty & Wellness"
  | "Education & Tutoring"
  | "Repair & Technical"
  | "Handmade Products"
  | "Other";

export interface ProductServiceItem {
  name: string;
  category: string;
  priceRange?: string;
  capacityPerMonth?: string;
  unit?: string;
  description?: string;
}

export interface LocationDetails {
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  areaType: "Urban" | "Semi-Urban" | "Rural";
  serviceRadiusKm: number;
}

export interface CapacityDetails {
  monthlyVolume: string;
  unit: string;
  leadTimeDays: number;
  peakCapacity?: string;
  scalabilityNotes?: string;
}

export interface ResourceDetails {
  equipment: string[];
  workspaceType: string;
  workspaceAreaSqFt?: number;
  workforceCount: number;
  hasDeliveryVehicle: boolean;
  rawMaterialAccess?: string;
}

export interface Registrations {
  udyam?: string;
  fssai?: string;
  artisanCard?: string;
  gstin?: string;
  pan?: string;
}

export interface BusinessProfile {
  id?: string;
  _id?: string;
  entrepreneurName: string;
  businessName: string;
  tradeName: string;
  tagline?: string;
  businessType: BusinessType;
  entityType: string;

  // The 6 Core Pillars
  skills: string[];
  productsServices: ProductServiceItem[];
  locationDetails: LocationDetails;
  capacityDetails: CapacityDetails;
  resourceDetails: ResourceDetails;
  businessGoals: string[];

  // Support & Readiness
  registrations: Registrations;
  turnoverFY: string;
  turnoverValue: number;
  readinessScore: number;
  phone?: string;
  email?: string;
  languagesSpoken: string[];
  notes?: string;

  // Legacy compatibility fields
  sector: SectorType | string;
  location: string;
  district: string;
  state: string;
  udyamStatus: "Active" | "Pending" | "Not Registered";
  udyamRegistrationNo?: string;
  gstin?: string;
  pan?: string;
  employeeCount: number;
  incorporationYear: number;
  nextRenewal?: string;
  complianceHealthScore: number;
}

export type OpportunityType =
  | "customer"
  | "business"
  | "bulk_order"
  | "partnership"
  | "marketplace"
  | "financing"
  | "government_scheme"
  | "support_program";

export interface OpportunityItem {
  _id?: string;
  id?: string;
  title: string;
  type: OpportunityType;
  category: string;
  organization: string;
  description: string;
  locationScope: {
    state?: string;
    city?: string;
    isPanIndia: boolean;
    serviceRadiusKm?: number;
  };
  estimatedValue: string;
  capacityNeeded?: string;
  requiredSkills: string[];
  eligibleCategories: string[];
  eligibilityCriteria: string[];
  keyBenefits: string[];
  deadline?: string;
  actionLabel: string;
  officialUrl?: string;
  contactPerson?: string;
  contactEmailOrPhone?: string;
  tags: string[];
  partnershipType?: "production_pooling" | "raw_material_group" | "cross_selling" | "shared_logistics";
}

export interface EligibilityFactor {
  criterion: string;
  status: "met" | "partially_met" | "action_needed";
  note: string;
}

export interface OpportunityMatchResult {
  opportunity: OpportunityItem;
  matchScore: number;
  whyMatches: string;
  eligibilityChecklist: EligibilityFactor[];
  valueProposition: string;
  recommendedNextStep: string;
}

export interface ExtractedStructuredProfile {
  entrepreneurName: string;
  businessName: string;
  tradeName: string;
  businessType: BusinessType | string;
  skills: string[];
  productsServices: ProductServiceItem[];
  locationDetails: LocationDetails;
  capacityDetails: CapacityDetails;
  resourceDetails: ResourceDetails;
  businessGoals: string[];
  readinessScore: number;
  confidence: number;
  summary: string;
  immediateRecommendations: string[];
}

export interface GeneratedPitch {
  recipientTitle: string;
  subject: string;
  salutation: string;
  executiveSummary: string;
  offeredCapacity: string;
  turnaroundTime: string;
  qualityAssurance: string;
  pricingProposal: string;
  callToAction: string;
}

export interface AdvisorChatResponse {
  replyText: string;
  actionableSteps: string[];
  suggestedQuestions: string[];
  relevantSchemesOrMarketplaces?: string[];
}

export interface DemoPersona extends BusinessProfile {
  id: string;
}

export interface ComplianceItem {
  id: string;
  title: string;
  category:
    | "Taxation"
    | "Labor & Safety"
    | "Environmental"
    | "Corporate Governance"
    | "License & Permit";
  issuingAuthority: string;
  periodicity: "Monthly" | "Quarterly" | "Annual" | "Bi-Annual" | "One-Time";
  status: ComplianceStatus;
  dueDate: string;
  description: string;
  potentialPenalty?: string;
}

export interface SchemeItem {
  id: string;
  title: string;
  ministry: string;
  category:
    | "Credit Guarantee"
    | "Technology Upgradation"
    | "Subsidy"
    | "Export Support"
    | "Infrastructure";
  description: string;
  fundingAmount: string;
  eligibilityMatch: number;
  eligibilityCriteria: string[];
  keyBenefits: string[];
  deadline: string;
  officialUrl?: string;
}

export interface TenderItem {
  id: string;
  title: string;
  issuingOrg: string;
  category: string;
  estimatedValue: string;
  location: string;
  submissionDeadline: string;
  matchScore: number;
  status: "Open" | "Under Review" | "Submitted";
  tenderNoticeNo: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuingBody: string;
  category:
    | "Quality"
    | "Safety"
    | "Environmental"
    | "Export"
    | "Sustainability";
  certificateNumber: string;
  validFrom: string;
  validUntil: string;
  status: "Active" | "Renewal Pending" | "Expired";
}

export interface ExtractedField {
  label: string;
  value: string;
  confidence: number;
}

export interface DocumentItem {
  id: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileSize: string;
  status: "Analyzed" | "Action Needed" | "Processing";
  confidenceScore: number;
  extractedFields: ExtractedField[];
  detectedIssues: string[];
  recommendations: string[];
  expiryDate?: string;
  review?: {
    extractedTextPreview: string;
    profileMatches: string[];
    profileMismatches: string[];
    missingInformation: string[];
    potentialIssues: string[];
    reviewReport: string;
    ragGuidance: string[];
  };
}

export interface DeadlineItem {
  id: string;
  title: string;
  category: string;
  dueDate: string;
  daysRemaining: number;
  status: "Urgent" | "Upcoming" | "Completed";
  priority: PriorityLevel;
  authority: string;
}

export interface ActionItem {
  id: string;
  title: string;
  category:
    | "Compliance"
    | "Grant Application"
    | "Document Fix"
    | "Tax Filing"
    | "Certification";
  priority: PriorityLevel;
  status: "Pending" | "In Progress" | "Completed";
  dueDate: string;
  estimatedTimeMinutes: number;
  impactSummary: string;
  steps: string[];
}

export interface SourceCitationMetadata {
  sourceName: string;
  officialUrl: string;
  documentTitle: string;
  lastVerifiedDate: string;
  category: string;
}

export interface RagCitation {
  docId: string;
  sourceName: string;
  officialUrl: string;
  documentTitle: string;
  lastVerifiedDate: string;
  category: string;
  matchedText: string;
  relevanceScore: number;
}

export interface AiRecommendationItem {
  title: string;
  relevanceMatch: string;
  whyRelevant: string;
  eligibilityFactors: string[];
  recommendedAction: string;
  deadline?: string;
  officialSource?: string;
  sourceMetadata?: SourceCitationMetadata;
}

export interface StructuredAiResponse {
  replyText: string;
  recommendations: AiRecommendationItem[];
  suggestedPrompts: string[];
  referencedDocs?: string[];
  retrievedCitations?: RagCitation[];
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  recommendations?: AiRecommendationItem[];
  suggestions?: string[];
  referencedDocs?: string[];
  retrievedCitations?: RagCitation[];
  actionableSteps?: string[];
  relevantSchemes?: string[];
}
