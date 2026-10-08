import { Request, Response } from 'express';
import { BusinessProfile } from '../models/BusinessProfile.js';

export const demoPersonas = [
  {
    id: 'persona_sunita',
    entrepreneurName: 'Sunita Devi',
    businessName: 'Devi Homemade Delights',
    tradeName: 'Devi Pickles & Spices',
    tagline: 'Traditional sun-dried Rajasthani pickles and organic spices',
    businessType: 'Food Production',
    entityType: 'Sole Proprietorship / Home Enterprise',
    skills: ['Traditional Pickle Curing', 'Spice Blending', 'Natural Fermentation', 'Sun-drying', 'Hygienic Preservation'],
    productsServices: [
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
    locationDetails: {
      address: 'Malviya Nagar',
      city: 'Jaipur',
      district: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302017',
      areaType: 'Urban',
      serviceRadiusKm: 50,
    },
    capacityDetails: {
      monthlyVolume: '80 kg',
      unit: 'kg',
      leadTimeDays: 3,
      peakCapacity: '150 kg',
      scalabilityNotes: 'Can scale with 2 additional helpers',
    },
    resourceDetails: {
      equipment: ['Stone mortar & pestle', 'Stainless steel mixing vats', 'Vacuum seal jars', 'Digital weighing scale'],
      workspaceType: 'Dedicated Home Kitchen',
      workspaceAreaSqFt: 180,
      workforceCount: 2,
      hasDeliveryVehicle: false,
      rawMaterialAccess: 'Direct procurement from local spice mandis and organic farmers',
    },
    businessGoals: [
      'Secure monthly recurring bulk supply orders with 3-5 local cafes, hotels or cloud kitchens',
      'Obtain ₹50,000 - ₹1,00,000 Mudra Shishu loan to purchase an electric vacuum sealing & jar labeling machine',
      'Get registered on ONDC (Open Network for Digital Commerce) for direct customer reach',
      'Obtain formal FSSAI Basic Registration & PMFME food processing subsidy assistance',
    ],
    registrations: {
      udyam: 'UDYAM-RJ-14-0084721',
      fssai: 'Applied / In Progress',
      artisanCard: '',
      gstin: '',
      pan: 'ABCDE1234F',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 4.5,
    readinessScore: 82,
    phone: '+91 98290 12345',
    email: 'sunita.devi@udyamsetu.in',
    languagesSpoken: ['Hindi', 'Marwari', 'Basic English'],
    notes: 'Home pickle maker looking to expand into commercial cafe supply and online marketplace channels.',
    sector: 'Agri-Processing',
    location: 'Malviya Nagar, Jaipur, Rajasthan',
    district: 'Jaipur',
    state: 'Rajasthan',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-RJ-14-0084721',
    employeeCount: 2,
    incorporationYear: 2022,
    complianceHealthScore: 85,
  },
  {
    id: 'persona_aarav',
    entrepreneurName: 'Aarav Sharma',
    businessName: 'Aarav Couture & Embroidery',
    tradeName: 'Aarav Boutique & Tailoring',
    tagline: 'Custom bridal lehengas, zari embroidery, and bespoke tailoring',
    businessType: 'Tailoring & Apparel',
    entityType: 'Home Enterprise',
    skills: ['Custom Blouse Stitching', 'Zari & Zardozi Hand Embroidery', 'Pattern Cutting', 'Bridal Alteration', 'Fabric Sourcing'],
    productsServices: [
      {
        name: 'Handcrafted Bridal Blouse with Zari Work',
        category: 'Apparel - Bespoke Tailoring',
        priceRange: '₹1,800 - ₹3,500 / pc',
        capacityPerMonth: '25 pcs',
        unit: 'pieces',
        description: 'Perfect-fit bridal and festive blouse stitching with custom embroidery',
      },
      {
        name: 'Designer Kurti & Anarkali Tailoring',
        category: 'Apparel - Custom Stitching',
        priceRange: '₹900 - ₹1,800 / pc',
        capacityPerMonth: '35 pcs',
        unit: 'pieces',
        description: 'Contemporary and traditional ethnic suits tailored with premium finish',
      },
    ],
    locationDetails: {
      address: 'Hazratganj Lane 4',
      city: 'Lucknow',
      district: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      areaType: 'Urban',
      serviceRadiusKm: 30,
    },
    capacityDetails: {
      monthlyVolume: '60 pieces',
      unit: 'pieces',
      leadTimeDays: 5,
      peakCapacity: '100 pieces',
      scalabilityNotes: 'Can scale with 2 additional master tailors',
    },
    resourceDetails: {
      equipment: ['2 Motorized Sewing Machines', 'Interlock Overlock Machine', 'Wooden Embroidery Adda Frame', 'Steam Iron'],
      workspaceType: 'Ground Floor Home Studio',
      workspaceAreaSqFt: 220,
      workforceCount: 3,
      hasDeliveryVehicle: true,
      rawMaterialAccess: 'Chowk fabric wholesale bazaar',
    },
    businessGoals: [
      'Partner with 2 retail designer boutiques in Delhi/Lucknow for contract stitching',
      'Apply for PM Vishwakarma scheme for ₹15,000 modern toolkits and ₹1L subsidized loan at 5%',
      'Launch signature festive line on Amazon Saheli & Etsy India',
    ],
    registrations: {
      udyam: 'UDYAM-UP-28-0091244',
      artisanCard: 'PEHCHAN-UP-4821',
      fssai: '',
      gstin: '',
      pan: 'BCDEF2345G',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 6.2,
    readinessScore: 88,
    phone: '+91 94150 87654',
    email: 'aarav.sharma@udyamsetu.in',
    languagesSpoken: ['Hindi', 'Urdu', 'English'],
    notes: 'Skilled Lucknowi zardozi and chikan specialist expanding into B2B fashion orders.',
    sector: 'Textiles',
    location: 'Hazratganj, Lucknow, UP',
    district: 'Lucknow',
    state: 'Uttar Pradesh',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-UP-28-0091244',
    employeeCount: 3,
    incorporationYear: 2021,
    complianceHealthScore: 90,
  },
  {
    id: 'persona_pooja',
    entrepreneurName: 'Pooja Patil',
    businessName: 'VedaHerb Handcrafted Soaps',
    tradeName: 'VedaHerb Naturals',
    tagline: 'Cold-processed herbal soaps, soy candles, and organic wellness gifts',
    businessType: 'Handmade Products',
    entityType: 'Home Enterprise',
    skills: ['Cold Process Soap Formulation', 'Natural Essential Oil Blending', 'Soy Wax Candle Pouring', 'Eco-friendly Packaging'],
    productsServices: [
      {
        name: 'Turmeric & Goat Milk Cold Process Soap',
        category: 'Personal Care - Handmade Soap',
        priceRange: '₹140 - ₹180 / bar',
        capacityPerMonth: '350 bars',
        unit: 'bars',
        description: '100% natural handmade soap with essential oils and zero artificial hardeners',
      },
      {
        name: 'Sandalwood & Jasmine Aromatic Soy Candle',
        category: 'Home Decor - Handcrafted Candle',
        priceRange: '₹280 - ₹450 / jar',
        capacityPerMonth: '150 jars',
        unit: 'jars',
        description: 'Hand-poured pure soy wax candle in reusable ceramic containers',
      },
    ],
    locationDetails: {
      address: 'Kothrud',
      city: 'Pune',
      district: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      areaType: 'Urban',
      serviceRadiusKm: 60,
    },
    capacityDetails: {
      monthlyVolume: '500 units',
      unit: 'units',
      leadTimeDays: 7,
      peakCapacity: '1,000 units',
      scalabilityNotes: 'Batch curing time is 3 weeks; can scale output with extra curing racks',
    },
    resourceDetails: {
      equipment: ['Silicone Loaf Molds', 'Stainless Immersion Blenders', 'Digital Thermometer', 'Wooden Curing Racks'],
      workspaceType: 'Home Workshop Room',
      workspaceAreaSqFt: 160,
      workforceCount: 2,
      hasDeliveryVehicle: false,
      rawMaterialAccess: 'Certified organic oils and butter distributors',
    },
    businessGoals: [
      'Supply bulk wedding return gift hampers and corporate festive gift boxes',
      'Join a synergy pod with a local handicraft basket maker for gift hamper bundling',
      'List on ONDC and premium zero-waste retail stores in Mumbai and Pune',
    ],
    registrations: {
      udyam: 'UDYAM-MH-26-0045192',
      fssai: '',
      artisanCard: '',
      gstin: '',
      pan: 'CDEFG3456H',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 5.8,
    readinessScore: 86,
    phone: '+91 98220 54321',
    email: 'pooja.patil@udyamsetu.in',
    languagesSpoken: ['Marathi', 'Hindi', 'English'],
    notes: 'Home maker crafting high-grade organic wellness products seeking corporate gifting orders.',
    sector: 'Manufacturing',
    location: 'Kothrud, Pune, Maharashtra',
    district: 'Pune',
    state: 'Maharashtra',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-MH-26-0045192',
    employeeCount: 2,
    incorporationYear: 2023,
    complianceHealthScore: 84,
  },
  {
    id: 'persona_rameshwar',
    entrepreneurName: 'Rameshwar Shilpkar',
    businessName: 'Kashi Terracotta & Brass Crafts',
    tradeName: 'Kashi Shilp Kendra',
    tagline: 'Sacred clay terracotta lamps, temple bells, and heritage brassware',
    businessType: 'Handicrafts & Art',
    entityType: 'Artisan Family Collective',
    skills: ['Terracotta Wheel Throwing', 'Brass Filigree Engraving', 'Traditional Clay Kiln Firing', 'Heritage Metal Casting'],
    productsServices: [
      {
        name: 'Handcrafted Terracotta Temple Diya Sets',
        category: 'Handicrafts - Terracotta',
        priceRange: '₹40 - ₹120 / set',
        capacityPerMonth: '500 sets',
        unit: 'sets',
        description: 'Eco-friendly natural alluvial clay diyas crafted using heritage Banaras methods',
      },
      {
        name: 'Etched Solid Brass Ghanta & Aarti Lamp',
        category: 'Handicrafts - Brassware',
        priceRange: '₹450 - ₹1,500 / pc',
        capacityPerMonth: '40 pcs',
        unit: 'pieces',
        description: 'Traditional heavy brass temple accessories hand-engraved with lotus motifs',
      },
    ],
    locationDetails: {
      address: 'Ramnagar Craft Cluster',
      city: 'Varanasi',
      district: 'Varanasi',
      state: 'Uttar Pradesh',
      pincode: '221008',
      areaType: 'Semi-Urban',
      serviceRadiusKm: 100,
    },
    capacityDetails: {
      monthlyVolume: '550 units',
      unit: 'units',
      leadTimeDays: 6,
      peakCapacity: '1,200 units',
      scalabilityNotes: 'Family artisan collective with 4 family members',
    },
    resourceDetails: {
      equipment: ['Electric & manual potter wheel', 'Wood-fired brick kiln', 'Metal engraving chisels', 'Polishing buffer'],
      workspaceType: 'Family Courtyard Workshop',
      workspaceAreaSqFt: 300,
      workforceCount: 4,
      hasDeliveryVehicle: false,
      rawMaterialAccess: 'River clay deposits & Moradabad brass ingots',
    },
    businessGoals: [
      'Access PM Vishwakarma scheme for ₹15,000 toolkits and ₹3L collateral-free credit at 5%',
      'Connect with temple trust and government souvenir procurement via GeM portal',
      'Participate in national craft exhibitions and ODOP (One District One Product) initiatives',
    ],
    registrations: {
      udyam: 'UDYAM-UP-70-0019284',
      artisanCard: 'PEHCHAN-UP-98421',
      fssai: '',
      gstin: '',
      pan: 'DEFGH4567I',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 3.8,
    readinessScore: 92,
    phone: '+91 94500 11223',
    email: 'rameshwar.shilpkar@udyamsetu.in',
    languagesSpoken: ['Hindi', 'Bhojpuri'],
    notes: '3rd generation artisan family seeking direct institutional market linkage without middlemen.',
    sector: 'Manufacturing',
    location: 'Ramnagar, Varanasi, UP',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-UP-70-0019284',
    employeeCount: 4,
    incorporationYear: 2017,
    complianceHealthScore: 88,
  },
  {
    id: 'persona_meera',
    entrepreneurName: 'Dr. Meera Iyer',
    businessName: 'Pratibha Vernacular STEM Academy',
    tradeName: 'Pratibha Learning Hub',
    tagline: 'Affordable interactive STEM coaching & bilingual science learning',
    businessType: 'Education & Tutoring',
    entityType: 'Micro Service Entity',
    skills: ['Bilingual Mathematics Pedagogy', 'Interactive Science Experiments', 'Board Exam Remedial Coaching', 'Digital Classroom Tools'],
    productsServices: [
      {
        name: 'Middle School STEM Coaching (Grades 6-10)',
        category: 'Education - After-School Tutoring',
        priceRange: '₹800 - ₹1,500 / month / student',
        capacityPerMonth: '40 students',
        unit: 'students',
        description: 'Conceptual science and math coaching with hands-on kits and weekly assessments',
      },
      {
        name: 'Remedial Foundational Numeracy Workshops',
        category: 'Education - Special Workshops',
        priceRange: '₹500 / student / batch',
        capacityPerMonth: '25 students',
        unit: 'students',
        description: 'Intensive weekend numeracy bridge courses for first-generation learners',
      },
    ],
    locationDetails: {
      address: 'Malleshwaram 8th Cross',
      city: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pincode: '560003',
      areaType: 'Urban',
      serviceRadiusKm: 15,
    },
    capacityDetails: {
      monthlyVolume: '65 students',
      unit: 'students',
      leadTimeDays: 1,
      peakCapacity: '100 students',
      scalabilityNotes: 'Can scale hybrid classes via video link',
    },
    resourceDetails: {
      equipment: ['Smart Projector', 'Whiteboard setup', '3 Tablets', 'Science Demo Kits'],
      workspaceType: 'Residential Ground Floor Learning Room',
      workspaceAreaSqFt: 250,
      workforceCount: 2,
      hasDeliveryVehicle: false,
      rawMaterialAccess: 'Educational publishers and open-source curriculums',
    },
    businessGoals: [
      'Partner with 2 local affordable private schools for after-school remedial STEM programs',
      'Obtain microloan under Mudra Kishore (₹1-2L) to equip a 10-computer mini digital lab',
      'Apply for Skill India and CSR education empowerment grants',
    ],
    registrations: {
      udyam: 'UDYAM-KR-03-0099412',
      fssai: '',
      artisanCard: '',
      gstin: '',
      pan: 'EFGHI5678J',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 4.2,
    readinessScore: 85,
    phone: '+91 98450 99887',
    email: 'meera.iyer@udyamsetu.in',
    languagesSpoken: ['Kannada', 'Tamil', 'English', 'Hindi'],
    notes: 'Passionate educator providing high-quality STEM tutoring to neighborhood students.',
    sector: 'Services',
    location: 'Malleshwaram, Bengaluru, Karnataka',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-KR-03-0099412',
    employeeCount: 2,
    incorporationYear: 2022,
    complianceHealthScore: 89,
  },
  {
    id: 'persona_imran',
    entrepreneurName: 'Imran Khan',
    businessName: 'SpeedFix Electronics & Appliances',
    tradeName: 'SpeedFix Mobile Care',
    tagline: 'Doorstep smartphone repairs, inverter servicing, and home electronics repair',
    businessType: 'Repair & Technical',
    entityType: 'Proprietorship',
    skills: ['Smartphone Motherboard Chip Diagnostics', 'SMD Soldering', 'Home Inverter & UPS Repair', 'Display & Battery Replacement', 'Doorstep Servicing'],
    productsServices: [
      {
        name: 'Doorstep Smartphone Screen & Battery Repair',
        category: 'Services - Mobile Repair',
        priceRange: '₹600 - ₹2,500 / device',
        capacityPerMonth: '90 repairs',
        unit: 'repairs',
        description: 'Certified 60-minute doorstep display and battery replacements with 3-month warranty',
      },
      {
        name: 'Inverter & PCB Repair Service',
        category: 'Services - Appliance Repair',
        priceRange: '₹450 - ₹1,800 / device',
        capacityPerMonth: '35 repairs',
        unit: 'repairs',
        description: 'Component-level troubleshooting for inverters, microwaves, and power supplies',
      },
    ],
    locationDetails: {
      address: 'Mehdipatnam Main Road',
      city: 'Hyderabad',
      district: 'Hyderabad',
      state: 'Telangana',
      pincode: '500028',
      areaType: 'Urban',
      serviceRadiusKm: 25,
    },
    capacityDetails: {
      monthlyVolume: '125 repairs',
      unit: 'repairs',
      leadTimeDays: 1,
      peakCapacity: '200 repairs',
      scalabilityNotes: 'Can onboard 2 junior technicians for field dispatch',
    },
    resourceDetails: {
      equipment: ['Digital Multimeter', 'Hot Air Rework Station', 'Microscope', 'Toolkit Backpack', 'Two-wheeler'],
      workspaceType: 'Compact Workshop Counter & Doorstep Kit',
      workspaceAreaSqFt: 120,
      workforceCount: 2,
      hasDeliveryVehicle: true,
      rawMaterialAccess: 'Jagdish Market wholesale spare parts hub',
    },
    businessGoals: [
      'Tie up with local housing societies and apartment associations for annual maintenance contracts (AMC)',
      'Secure Mudra Shishu loan of ₹50,000 to buy advanced thermal camera & oscilloscope for motherboard repair',
      'Register on ONDC services network and Urban Company partner portal',
    ],
    registrations: {
      udyam: 'UDYAM-TL-07-0034189',
      fssai: '',
      artisanCard: '',
      gstin: '',
      pan: 'FGHIJ6789K',
    },
    turnoverFY: 'FY 2025-26',
    turnoverValue: 7.4,
    readinessScore: 89,
    phone: '+91 99890 33445',
    email: 'imran.khan@udyamsetu.in',
    languagesSpoken: ['Telugu', 'Hindi', 'Urdu', 'English'],
    notes: 'Skilled technician offering dependable doorstep electronics and phone repair.',
    sector: 'Services',
    location: 'Mehdipatnam, Hyderabad, Telangana',
    district: 'Hyderabad',
    state: 'Telangana',
    udyamStatus: 'Active',
    udyamRegistrationNo: 'UDYAM-TL-07-0034189',
    employeeCount: 2,
    incorporationYear: 2020,
    complianceHealthScore: 92,
  },
];

export const getBusinessProfile = async (req: Request, res: Response) => {
  try {
    let profile = await BusinessProfile.findOne();
    if (!profile) {
      profile = new BusinessProfile(demoPersonas[0]);
      await profile.save();
    }
    return res.json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateBusinessProfile = async (req: Request, res: Response) => {
  try {
    let profile = await BusinessProfile.findOne();
    if (!profile) {
      profile = new BusinessProfile(req.body);
    } else {
      Object.assign(profile, req.body);
    }
    await profile.save();
    return res.json(profile);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};

export const getDemoPersonas = (req: Request, res: Response) => {
  return res.json(demoPersonas);
};

export const switchPersona = async (req: Request, res: Response) => {
  try {
    const { personaId } = req.body;
    const persona = demoPersonas.find((p) => p.id === personaId) || demoPersonas[0];

    let profile = await BusinessProfile.findOne();
    if (!profile) {
      profile = new BusinessProfile(persona);
    } else {
      // Overwrite with chosen persona
      Object.assign(profile, persona);
    }
    await profile.save();

    return res.json({
      success: true,
      message: `Switched active profile to ${persona.entrepreneurName} (${persona.businessType})`,
      profile,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
};
