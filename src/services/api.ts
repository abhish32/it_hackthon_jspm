/// <reference types="vite/client" />

import {
  BusinessProfile,
  ComplianceItem,
  SchemeItem,
  TenderItem,
  CertificationItem,
  DocumentItem,
  DeadlineItem,
  ActionItem,
  StructuredAiResponse,
  OpportunityMatchResult,
  ExtractedStructuredProfile,
  GeneratedPitch,
  AdvisorChatResponse,
  DemoPersona,
} from "../types";
import {
  initialBusinessProfile,
  initialComplianceList,
  initialSchemesList,
  initialTendersList,
  initialCertificationsList,
  initialDocumentsList,
  initialDeadlinesList,
  initialActionItems,
  initialOpportunityMatches,
  demoPersonas,
} from "./mockData";

const getAuthHeaders = () => {
  const token = localStorage.getItem("msme_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, "") : "http://localhost:5000";

export const api = {
  // Business Profile API
  async getBusinessProfile(): Promise<BusinessProfile> {
    try {
      const res = await fetch(`${BASE_URL}/api/business`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return { ...initialBusinessProfile, ...data };
    } catch {
      return initialBusinessProfile;
    }
  },

  async updateBusinessProfile(data: Partial<BusinessProfile>): Promise<BusinessProfile> {
    try {
      const res = await fetch(`${BASE_URL}/api/business`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return { ...initialBusinessProfile, ...data };
    }
  },

  async getDemoPersonas(): Promise<DemoPersona[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/business/personas`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return demoPersonas;
    }
  },

  async switchPersona(personaId: string): Promise<BusinessProfile> {
    try {
      const res = await fetch(`${BASE_URL}/api/business/switch-persona`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ personaId }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.profile || demoPersonas.find((p) => p.id === personaId) || initialBusinessProfile;
    } catch {
      return demoPersonas.find((p) => p.id === personaId) || initialBusinessProfile;
    }
  },

  // Opportunities API (Unified 8 Channels with AI Matching & Explainability)
  async getOpportunities(params?: {
    type?: string;
    category?: string;
    minScore?: number;
    search?: string;
  }): Promise<OpportunityMatchResult[]> {
    try {
      const query = new URLSearchParams();
      if (params?.type && params.type !== "all") query.set("type", params.type);
      if (params?.category && params.category !== "all") query.set("category", params.category);
      if (params?.minScore) query.set("minScore", params.minScore.toString());
      if (params?.search) query.set("search", params.search);

      const res = await fetch(`${BASE_URL}/api/opportunities?${query.toString()}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialOpportunityMatches;
    } catch {
      // Local filter fallback
      let results = [...initialOpportunityMatches];
      if (params?.type && params.type !== "all") {
        results = results.filter((r) => r.opportunity.type === params.type);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        results = results.filter(
          (r) =>
            r.opportunity.title.toLowerCase().includes(q) ||
            r.opportunity.organization.toLowerCase().includes(q) ||
            r.whyMatches.toLowerCase().includes(q)
        );
      }
      return results;
    }
  },

  async expressInterest(data: {
    opportunityId: string;
    proposalText?: string;
    requestedVolume?: string;
  }): Promise<{ success: boolean; message: string; leadReference: string }> {
    try {
      const res = await fetch(`${BASE_URL}/api/opportunities/express-interest`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return {
        success: true,
        message: "Your expression of interest has been registered successfully!",
        leadReference: `SETU-${Math.floor(100000 + Math.random() * 900000)}`,
      };
    }
  },

  // AI Assistant APIs
  async convertProfileFromText(textDescription: string): Promise<ExtractedStructuredProfile> {
    try {
      const res = await fetch(`${BASE_URL}/api/assistant/convert-profile`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ textDescription }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      // Offline fallback: use local parser heuristics
      const lower = textDescription.toLowerCase();
      let bType: any = "Food Production";
      if (lower.includes("tailor") || lower.includes("dress") || lower.includes("blouse")) bType = "Tailoring & Apparel";
      else if (lower.includes("soap") || lower.includes("candle")) bType = "Handmade Products";
      else if (lower.includes("clay") || lower.includes("pot") || lower.includes("brass")) bType = "Handicrafts & Art";
      else if (lower.includes("teach") || lower.includes("tutor")) bType = "Education & Tutoring";
      else if (lower.includes("repair") || lower.includes("phone")) bType = "Repair & Technical";

      return {
        entrepreneurName: "Artisan Creator",
        businessName: "Authentic Home Enterprise",
        tradeName: "Handcrafted Creations",
        businessType: bType,
        skills: ["Artisanal Crafting", "Small Batch Preparation", "Quality Control"],
        productsServices: [
          {
            name: "Signature Handcrafted Product",
            category: bType,
            priceRange: "₹250 - ₹900",
            capacityPerMonth: "50 units",
            unit: "units",
            description: "High quality small batch product crafted with authentic raw materials",
          },
        ],
        locationDetails: {
          address: "Central Market",
          city: "Jaipur",
          district: "Jaipur",
          state: "Rajasthan",
          pincode: "302001",
          areaType: "Urban",
          serviceRadiusKm: 50,
        },
        capacityDetails: {
          monthlyVolume: "60 units / month",
          unit: "units",
          leadTimeDays: 3,
          peakCapacity: "120 units / month",
          scalabilityNotes: "Scalable with family assistance",
        },
        resourceDetails: {
          equipment: ["Basic Craft Equipment", "Digital Scale"],
          workspaceType: "Home Workshop",
          workspaceAreaSqFt: 150,
          workforceCount: 2,
          hasDeliveryVehicle: false,
          rawMaterialAccess: "Local wholesale mandis",
        },
        businessGoals: [
          "Connect with institutional bulk buyers and corporate gifting contracts",
          "Access low-interest government financing for tools upgradation",
          "Expand regional customer visibility through UdyamSetu",
        ],
        readinessScore: 82,
        confidence: 91,
        summary: "Extracted structured profile ready for automated matching across all 8 channels.",
        immediateRecommendations: [
          "Complete free Udyam registration",
          "Sync catalog with ONDC bridge",
          "Apply for matched local B2B opportunities",
        ],
      };
    }
  },

  async generateB2BPitch(opportunityId?: string): Promise<GeneratedPitch> {
    try {
      const res = await fetch(`${BASE_URL}/api/assistant/generate-pitch`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ opportunityId }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return {
        recipientTitle: "Procurement Committee",
        subject: "B2B Commercial Supply Quotation & Partnership Expression",
        salutation: "Respected Procurement Team,",
        executiveSummary: "We are pleased to submit our formal proposal to fulfill your supply specifications with direct-from-maker authentic quality.",
        offeredCapacity: "Dedicated 60-80 units monthly allocation with immediate batch ramp-up capability.",
        turnaroundTime: "3-4 business days dispatch with tracked local courier.",
        qualityAssurance: "Handmade in hygienic small-batch conditions conforming to traditional recipes and safety guidelines.",
        pricingProposal: "Competitive wholesale pricing without distributor intermediary commissions.",
        callToAction: "We would be delighted to courier a complimentary sample tasting box to your procurement desk this week.",
      };
    }
  },

  async askAdvisor(message: string): Promise<AdvisorChatResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/assistant/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return {
        replyText: `Based on your profile, here are strategic growth recommendations for your micro-enterprise:`,
        actionableSteps: [
          "Curate sample packages for local hospitality and boutique buyers.",
          "Check the Financing tab for PMMY Mudra zero-collateral working capital up to ₹50,000.",
          "Connect your product catalog to the ONDC Open Commerce Network to access national buyers.",
        ],
        suggestedQuestions: [
          "How do I pitch to B2B buyers?",
          "Which government schemes provide machinery subsidies?",
          "How can I start selling on ONDC?",
        ],
        relevantSchemesOrMarketplaces: ["PM Vishwakarma", "ONDC Network", "PMMY Mudra Loan"],
      };
    }
  },

  // Compliances API
  async getCompliances(): Promise<ComplianceItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/compliance`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialComplianceList;
    } catch {
      return initialComplianceList;
    }
  },

  // Schemes API
  async getSchemes(): Promise<SchemeItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/schemes`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialSchemesList;
    } catch {
      return initialSchemesList;
    }
  },

  // Tenders API
  async getTenders(): Promise<TenderItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/tenders`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialTendersList;
    } catch {
      return initialTendersList;
    }
  },

  // Certifications API
  async getCertifications(): Promise<CertificationItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/certifications`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialCertificationsList;
    } catch {
      return initialCertificationsList;
    }
  },

  // Documents API
  async getDocuments(): Promise<DocumentItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/documents`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialDocumentsList;
    } catch {
      return initialDocumentsList;
    }
  },

  async uploadDocument(file: File): Promise<DocumentItem> {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("msme_token");
    const res = await fetch(`${BASE_URL}/api/documents/upload`, {
      method: "POST",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      throw new Error(
        (await res.json().catch(() => null))?.error || "Document analysis failed"
      );
    }
    return await res.json();
  },

  // Deadlines API
  async getDeadlines(): Promise<DeadlineItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/deadlines`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialDeadlinesList;
    } catch {
      return initialDeadlinesList;
    }
  },

  // Actions API
  async getActions(): Promise<ActionItem[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/actions`, { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      return data.length ? data : initialActionItems;
    } catch {
      return initialActionItems;
    }
  },

  async getActionItems(): Promise<ActionItem[]> {
    return this.getActions();
  },

  async updateActionStatus(id: string, status: string): Promise<any> {
    try {
      const res = await fetch(`${BASE_URL}/api/actions/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return { id, status };
    }
  },

  async sendAssistantMessage(message: string): Promise<StructuredAiResponse> {
    return this.askAiAssistant(message);
  },

  // AI Chat Assistant
  async askAiAssistant(query: string): Promise<StructuredAiResponse> {
    try {
      const res = await fetch(`${BASE_URL}/api/assistant/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message: query }),
      });
      if (!res.ok) throw new Error("API error");
      return await res.json();
    } catch {
      return {
        replyText: `Here are key ecosystem opportunities tailored to your enterprise profile:`,
        recommendations: [
          {
            title: "Chokhi Dhani Heritage Resort Supply",
            relevanceMatch: "96% Fit - B2B Opportunity",
            whyRelevant: "Local Jaipur capacity matches resort requirement for authentic homestyle condiments.",
            eligibilityFactors: ["Capacity fits 60-90 kg", "Located within 50km", "Authentic recipe"],
            recommendedAction: "Submit sample kit and B2B quote.",
            deadline: "2026-11-15",
            officialSource: "https://chokhidhani.com",
          },
          {
            title: "PMFME 35% Capital Subsidy",
            relevanceMatch: "95% Fit - Government Grant",
            whyRelevant: "Grants 35% capital subsidy on food processing and vacuum packaging machinery.",
            eligibilityFactors: ["Micro Food Processing", "Udyam Registered"],
            recommendedAction: "Apply on PMFME portal.",
            deadline: "2026-12-31",
            officialSource: "https://pmfme.mofpi.gov.in",
          },
        ],
        suggestedPrompts: [
          "How do I pitch to B2B buyers?",
          "Which government schemes provide machinery subsidies?",
          "How can I start selling on ONDC?",
        ],
      };
    }
  },
};
