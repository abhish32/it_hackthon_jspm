import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { BusinessProfile } from '../models/BusinessProfile.js';
import { Opportunity } from '../models/Opportunity.js';
import { demoPersonas } from '../controllers/businessController.js';
export async function seedInitialData() {
    try {
        console.log('🌱 Checking UdyamSetu database seeding status...');
        // 1. Ensure User exists
        let user = await User.findOne();
        if (!user) {
            const passwordHash = await bcrypt.hash('password123', 10);
            user = await User.create({
                email: 'sunita.devi@udyamsetu.in',
                passwordHash,
                name: 'Sunita Devi',
                role: 'owner',
            });
            console.log('✅ Created default entrepreneur user:', user.email);
        }
        // 2. Ensure BusinessProfile exists with all 6 pillars
        let profile = await BusinessProfile.findOne();
        if (!profile) {
            const initial = demoPersonas[0];
            profile = await BusinessProfile.create({
                ...initial,
                userId: user._id,
            });
            user.businessProfileId = profile._id;
            await user.save();
            console.log('✅ Created initial UdyamSetu business profile:', profile.businessName);
        }
        // 3. Ensure Opportunities exist across all 8 streams
        const oppCount = await Opportunity.countDocuments();
        if (oppCount < 5) {
            console.log('🌱 Seeding rich opportunities for 8 UdyamSetu channels...');
            await Opportunity.deleteMany({}); // refresh opportunities
            const initialOpportunities = [
                // STREAM 1: DIRECT CUSTOMERS & COMMUNITY DEMAND
                {
                    title: 'Jaipur Heritage & Organic Food Bazaar Pop-up Stall',
                    type: 'customer',
                    category: 'Food Production',
                    organization: 'Jaipur Organic Farmers & Homemakers Collective',
                    description: 'Weekly weekend artisan market at Central Park, Jaipur. Connects home pickle, preserve, and spice makers directly with 1,500+ conscious urban consumers.',
                    locationScope: { state: 'Rajasthan', city: 'Jaipur', isPanIndia: false, serviceRadiusKm: 30 },
                    estimatedValue: '₹18,000 - ₹35,000 / weekend',
                    capacityNeeded: '30 - 50 kg per weekend',
                    requiredSkills: ['Traditional Pickle Curing', 'Spice Blending', 'Natural Fermentation'],
                    eligibleCategories: ['Food Production', 'Handmade Products', 'All'],
                    eligibilityCriteria: ['Basic food hygiene compliance', 'Eco-friendly glass/paper packaging preferred'],
                    keyBenefits: ['Direct cash/UPI payments', 'Zero commission stall fee subsidy for women makers', 'Direct customer feedback & repeat subscriber list'],
                    deadline: 'Every Friday rolling registration',
                    actionLabel: 'Book Pop-Up Stall',
                    officialUrl: 'https://jaipurbazaar.org',
                    tags: ['Weekend Market', 'Direct Consumer', 'Zero Middlemen', 'Jaipur'],
                },
                {
                    title: 'Gated Residential Society Monthly Artisan Pop-up Haat',
                    type: 'customer',
                    category: 'Handmade Products',
                    organization: 'Pune Premium Societies Federation',
                    description: 'Monthly weekend pop-up exhibition in mega residential townships across Pune (Kothrud, Baner, Wakad) for organic soaps, candles, and handcrafted home accessories.',
                    locationScope: { state: 'Maharashtra', city: 'Pune', isPanIndia: false, serviceRadiusKm: 40 },
                    estimatedValue: '₹25,000 - ₹50,000 / event',
                    capacityNeeded: '150 - 300 units',
                    requiredSkills: ['Cold Process Soap Formulation', 'Soy Wax Candle Pouring', 'Custom Packaging'],
                    eligibleCategories: ['Handmade Products', 'Food Production', 'Handicrafts & Art', 'All'],
                    eligibilityCriteria: ['Handmade or chemical-free certification/declaration'],
                    keyBenefits: ['Affluent residential crowd', 'Instant WhatsApp customer group additions', 'No security deposit'],
                    deadline: 'Monthly rolling entry',
                    actionLabel: 'Register Exhibition Desk',
                    officialUrl: 'https://puneartisanhaat.in',
                    tags: ['Community Haat', 'Urban Customers', 'High Conversion', 'Pune'],
                },
                // STREAM 2: BUSINESSES (B2B COMMERCIAL CLIENTS)
                {
                    title: 'Chokhi Dhani Heritage Resort - Authentic Homestyle Pickle Supplier',
                    type: 'business',
                    category: 'Food Production',
                    organization: 'Chokhi Dhani Hospitality Group, Jaipur',
                    description: 'Prestigious heritage resort seeks a home-based artisan maker for daily buffet and retail counter supply of authentic Rajasthani mango, ker-sangri, and red chilli pickles.',
                    locationScope: { state: 'Rajasthan', city: 'Jaipur', isPanIndia: false, serviceRadiusKm: 50 },
                    estimatedValue: '₹40,000 - ₹65,000 / month',
                    capacityNeeded: '60 - 90 kg / month',
                    requiredSkills: ['Traditional Pickle Curing', 'Spice Blending', 'Hygienic Preservation'],
                    eligibleCategories: ['Food Production'],
                    eligibilityCriteria: ['Consistent taste profile', 'FSSAI basic registration or willingness to obtain', 'Capacity of at least 50 kg/month'],
                    keyBenefits: ['12-month recurring contract', 'Bi-weekly advance payment', 'Branded showcase mention in resort culinary menu'],
                    deadline: '2026-11-15',
                    actionLabel: 'Submit B2B Quotation & Sample',
                    officialUrl: 'https://chokhidhani.com/procurement',
                    tags: ['Hospitality B2B', 'Recurring Contract', 'Heritage Resort', 'Food'],
                },
                {
                    title: 'FabHeritage Boutiques - Lucknowi Zari & Chikan Contract Stitching',
                    type: 'business',
                    category: 'Tailoring & Apparel',
                    organization: 'FabHeritage Fashion Studios, Delhi & Lucknow',
                    description: 'Designer ethnic brand sourcing verified home-based master tailors for small-batch contract embroidery and bridal kurti stitching.',
                    locationScope: { state: 'Uttar Pradesh', city: 'Lucknow', isPanIndia: false, serviceRadiusKm: 60 },
                    estimatedValue: '₹55,000 - ₹80,000 / month',
                    capacityNeeded: '30 - 50 pieces / month',
                    requiredSkills: ['Custom Blouse Stitching', 'Zari & Zardozi Hand Embroidery', 'Pattern Cutting'],
                    eligibleCategories: ['Tailoring & Apparel'],
                    eligibilityCriteria: ['Sample quality benchmark verification', 'Dedicated sewing machines'],
                    keyBenefits: ['Raw fabrics provided by brand', 'Fixed per-piece labor payment of ₹1,400 - ₹2,500', 'Long term seasonal retainer'],
                    deadline: '2026-11-30',
                    actionLabel: 'Submit Portfolio & Pitch',
                    officialUrl: 'https://fabheritage.in/artisan-portal',
                    tags: ['Fashion B2B', 'Designer Boutique', 'Textile Contract', 'Lucknow'],
                },
                // STREAM 3: BULK ORDERS (INSTITUTIONAL & FESTIVAL ORDERS)
                {
                    title: 'Diwali Corporate Festive Gift Hampers (500 Units)',
                    type: 'bulk_order',
                    category: 'Food Production',
                    organization: 'Infosys & Tech Mahindra Rajasthan CSR & Employee Welfare',
                    description: 'Consortium of IT companies procuring 500 artisanal gift hampers containing heirloom pickles, organic spice mixes, and handloom tea towels for corporate gifting.',
                    locationScope: { state: 'Rajasthan', city: 'Jaipur', isPanIndia: true },
                    estimatedValue: '₹2,50,000 total order value',
                    capacityNeeded: '80 - 120 kg or 500 mini jars (250g)',
                    requiredSkills: ['Traditional Pickle Curing', 'Hygienic Preservation', 'Custom Packaging'],
                    eligibleCategories: ['Food Production', 'Handmade Products'],
                    eligibilityCriteria: ['Ability to deliver within 21 days', 'Food grade tamper-evident sealing'],
                    keyBenefits: ['50% advance mobilization advance upon PO issuance', 'Consortium co-bidding allowed via UdyamSetu pods', 'National corporate exposure'],
                    deadline: '2026-10-31',
                    actionLabel: 'Bid on Bulk Order',
                    officialUrl: 'https://corporatehamper.procure.in',
                    tags: ['Corporate Gifting', 'Diwali Bulk', 'High Value', 'Festive'],
                },
                {
                    title: 'Royal Destination Wedding Return Favors (350 Souvenir Boxes)',
                    type: 'bulk_order',
                    category: 'Handicrafts & Art',
                    organization: 'Udaipur & Varanasi Destination Weddings Collective',
                    description: 'High-profile wedding planners seeking 350 handcrafted brass bells, terracotta scented diyas, or traditional handcrafted wellness boxes with personalized engraving.',
                    locationScope: { state: 'Uttar Pradesh', city: 'Varanasi', isPanIndia: true },
                    estimatedValue: '₹1,75,000 total order',
                    capacityNeeded: '350 units over 14 days',
                    requiredSkills: ['Terracotta Wheel Throwing', 'Brass Filigree Engraving', 'Handmade Crafting'],
                    eligibleCategories: ['Handicrafts & Art', 'Handmade Products'],
                    eligibilityCriteria: ['High visual finishing standards', 'Safe transit carton packing'],
                    keyBenefits: ['Immediate 40% booking token', 'Featured wedding credits on social channels', 'Direct repeat orders from event planners'],
                    deadline: '2026-11-20',
                    actionLabel: 'Submit Custom Wedding Bid',
                    officialUrl: 'https://destinationfavors.in',
                    tags: ['Wedding Favors', 'Luxury Bulk', 'Handicraft', 'Varanasi'],
                },
                // STREAM 4: PARTNERSHIPS & SYNERGY PODS (CO-OPS)
                {
                    title: 'Synergy Pod: Organic Honey Producer + Artisan Pickle Maker Gift Combo',
                    type: 'partnership',
                    category: 'Food Production',
                    organization: 'Aravali Forest Honey Collective & UdyamSetu Synergy Hub',
                    description: 'Certified forest honey producer in Alwar seeking a traditional pickle & preserve maker to co-package an "Authentic Taste of Rajasthan" gift box for online marketplaces.',
                    locationScope: { state: 'Rajasthan', city: 'Jaipur', isPanIndia: false },
                    estimatedValue: '₹60,000 combined monthly recurring split',
                    capacityNeeded: '40 - 60 kg complementary capacity',
                    requiredSkills: ['Traditional Pickle Curing', 'Spice Blending'],
                    eligibleCategories: ['Food Production'],
                    eligibilityCriteria: ['Complementary non-competing food product', 'Shared quality ethos'],
                    keyBenefits: ['Double your market reach by sharing customer bases', 'Halve shipping and packaging box costs', 'Access unified bulk gift orders together'],
                    deadline: 'Open matching',
                    actionLabel: 'Join Synergy Pod',
                    officialUrl: 'https://udyamsetu.in/pods/honey-pickle',
                    partnershipType: 'production_pooling',
                    tags: ['Creator Pod', 'Cross-Selling', 'Shared Packaging', 'Rajasthan'],
                },
                {
                    title: 'Shared Commercial Cloud Kitchen & FSSAI Lab Pod',
                    type: 'partnership',
                    category: 'Food Production',
                    organization: 'Jaipur Women Micro-Makers Incubator',
                    description: 'Cooperative sharing of a certified commercial-grade kitchen, industrial dehydrators, and automated bottle capping machine among 5 home food producers.',
                    locationScope: { state: 'Rajasthan', city: 'Jaipur', isPanIndia: false, serviceRadiusKm: 25 },
                    estimatedValue: 'Saves ₹8,500/month on individual equipment rental',
                    capacityNeeded: 'Shared 15 hrs / week access',
                    requiredSkills: ['Food Hygiene', 'Small Batch Production'],
                    eligibleCategories: ['Food Production'],
                    eligibilityCriteria: ['Women or home-based food entrepreneur in Jaipur'],
                    keyBenefits: ['Instant shared FSSAI state-level license compliance', 'Industrial machinery access with zero capital outlay', 'Bulk buying raw mustard oil at 22% wholesale discount'],
                    deadline: 'Rolling batch admission',
                    actionLabel: 'Request Kitchen Pod Slot',
                    officialUrl: 'https://jaipurkitchenhub.org',
                    partnershipType: 'raw_material_group',
                    tags: ['Shared Kitchen', 'Cost Reduction', 'FSSAI License', 'Cooperative'],
                },
                // STREAM 5: MARKETPLACES (ONDC, GEM, AMAZON SAHELI, ETSY)
                {
                    title: 'ONDC (Open Network for Digital Commerce) - National Seller Onboarding',
                    type: 'marketplace',
                    category: 'All',
                    organization: 'ONDC Network & Ministry of Commerce',
                    description: 'Sell directly to buyers across Paytm, Magicpin, Mystore, and Pincode without heavy 30% commission cuts. UdyamSetu provides 1-click catalog mapping and automated order sync.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: 'Zero onboarding fee + 3-5% transaction charge only',
                    capacityNeeded: 'Any capacity (from 10 units/month to 5,000)',
                    requiredSkills: ['Quality Packaging', 'Smartphone Access'],
                    eligibleCategories: ['All', 'Food Production', 'Tailoring & Apparel', 'Handicrafts & Art', 'Handmade Products'],
                    eligibilityCriteria: ['Udyam Registration Certificate (Free online)', 'Basic bank account for direct settlement'],
                    keyBenefits: ['Access to 10+ crore digital buyers nationally', 'Doorstep pickup via Shadowfax, Delhivery, Dunzo', 'Complete ownership of your customer relationship'],
                    deadline: 'Always Active',
                    actionLabel: 'Connect via 1-Click ONDC Bridge',
                    officialUrl: 'https://ondc.org',
                    tags: ['ONDC', 'Open Commerce', 'Zero Middlemen', 'National Reach'],
                },
                {
                    title: 'GeM Sahay - Government Direct Purchase for Micro-Artisans',
                    type: 'marketplace',
                    category: 'All',
                    organization: 'Government e-Marketplace (GeM), Govt of India',
                    description: 'Statutory mandate requiring PSUs and central ministries to procure at least 25% of annual items from micro and small enterprises. Pre-qualify for direct purchase orders up to ₹5 Lakhs.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: 'Contracts from ₹50,000 to ₹15,00,000',
                    capacityNeeded: 'Scalable batch supply',
                    requiredSkills: ['Consistent Craft / Product Quality'],
                    eligibleCategories: ['All', 'Handicrafts & Art', 'Tailoring & Apparel', 'Food Production', 'Repair & Technical'],
                    eligibilityCriteria: ['Active Udyam Registration number', 'Aadhaar verified bank account'],
                    keyBenefits: ['Exemption from tender earnest money deposit (EMD)', 'Mandatory 10-day payment guarantee on GeM portal', 'Direct orders from state guest houses, railway offices, and schools'],
                    deadline: 'Open Portal',
                    actionLabel: 'Register on GeM Sahay',
                    officialUrl: 'https://gem.gov.in',
                    tags: ['Govt Procurement', 'GeM Sahay', 'Zero EMD', 'Guaranteed Payment'],
                },
                // STREAM 6: FINANCING OPPORTUNITIES (MUDRA, PMEGP, SHG)
                {
                    title: 'Pradhan Mantri MUDRA Yojana (PMMY) - Shishu & Kishore Microloans',
                    type: 'financing',
                    category: 'All',
                    organization: 'Ministry of Finance & Partner Public Sector Banks (SBI/PNB/Canara)',
                    description: 'Zero-collateral microloans designed specifically for small home producers, tailors, artisans, and service providers. Shishu tranche up to ₹50,000; Kishore tranche up to ₹5,00,000.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: '₹50,000 to ₹5,00,000 Collateral-Free Credit',
                    capacityNeeded: 'N/A',
                    requiredSkills: ['Active commercial micro-enterprise operation'],
                    eligibleCategories: ['All'],
                    eligibilityCriteria: ['Non-farm micro-business enterprise', 'Indian citizen with clean repayment history', 'Udyam registration preferred'],
                    keyBenefits: ['No property mortgage or third-party guarantee needed', 'Low interest rate (8.5% - 10.5% p.a.) with flexible 5-year tenure', 'Mudra RuPay debit card for day-to-day working capital drawdowns'],
                    deadline: 'Available year-round across all bank branches',
                    actionLabel: 'Generate Pre-Filled Mudra Application',
                    officialUrl: 'https://mudra.org.in',
                    tags: ['Zero Collateral', 'Mudra Loan', 'Working Capital', 'Govt Backed'],
                },
                {
                    title: 'PMEGP (Prime Minister Employment Generation Programme) - 35% Capital Subsidy',
                    type: 'financing',
                    category: 'All',
                    organization: 'KVIC & Ministry of MSME, Govt of India',
                    description: 'Credit-linked subsidy scheme offering 25% (urban) to 35% (rural / women / special category) non-refundable government subsidy on project loans up to ₹50 Lakhs for manufacturing.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: '35% Non-Refundable Capital Subsidy (Up to ₹17.5 Lakhs)',
                    capacityNeeded: 'Expansion project plan',
                    requiredSkills: ['Micro-manufacturing or service experience'],
                    eligibleCategories: ['All', 'Food Production', 'Tailoring & Apparel', 'Handicrafts & Art', 'Handmade Products'],
                    eligibilityCriteria: ['Applicant age 18+', 'Minimum 8th pass for projects above ₹10 Lakhs', 'New project setup or formalization'],
                    keyBenefits: ['Government pays 35% of loan directly into margin subsidy account', '3-year lock-in followed by full grant conversion', 'Includes free EDP entrepreneurship training'],
                    deadline: '2026-12-31',
                    actionLabel: 'Check PMEGP Subsidy Eligibility',
                    officialUrl: 'https://kviconline.gov.in/pmegp',
                    tags: ['35% Subsidy', 'KVIC', 'Capital Grant', 'High Impact'],
                },
                // STREAM 7: GOVERNMENT SCHEMES & SUBSIDIES
                {
                    title: 'PM Vishwakarma Scheme - ₹15k Modern Toolkit + ₹3L 5% Concessional Loan',
                    type: 'government_scheme',
                    category: 'All',
                    organization: 'Ministry of MSME, Govt of India',
                    description: 'Flagship central scheme for traditional artisans & craftspeople across 18 trades (Tailor / Darzi, Potter / Kumhaar, Blacksmith / Luhar, Sculptor / Murti-kar, Cobbler, etc.).',
                    locationScope: { isPanIndia: true },
                    estimatedValue: '₹15,000 Free Toolkit + ₹3,00,000 Loan @ 5% Subsidized Interest',
                    capacityNeeded: 'Traditional artisan or trade skill',
                    requiredSkills: ['Tailoring', 'Pottery', 'Metalcraft', 'Carpentry', 'Traditional Craft'],
                    eligibleCategories: ['Tailoring & Apparel', 'Handicrafts & Art', 'Repair & Technical', 'All'],
                    eligibilityCriteria: ['Practicing one of the 18 designated traditional trades', 'Aadhaar-seeded bank account', 'Family age 18+'],
                    keyBenefits: ['Official PM Vishwakarma Certificate & Digital ID Card', '5 to 7 days basic skill training with ₹500/day daily stipend', '₹15,000 e-voucher for modern automated toolkits', 'Collateral-free credit: ₹1 Lakh tranche 1, ₹2 Lakh tranche 2 at just 5% interest'],
                    deadline: 'Active nationwide',
                    actionLabel: 'Apply for PM Vishwakarma',
                    officialUrl: 'https://pmvishwakarma.gov.in',
                    tags: ['PM Vishwakarma', '15k Toolkit Grant', '5% Interest', 'Traditional Trades'],
                },
                {
                    title: 'PMFME Scheme - 35% Capital Subsidy for Micro Food Processing Units',
                    type: 'government_scheme',
                    category: 'Food Production',
                    organization: 'Ministry of Food Processing Industries (MoFPI)',
                    description: 'Tailored for individual home-based food makers (pickles, papads, spices, bakery, sweets). Provides 35% credit-linked capital subsidy up to ₹10 Lakhs per micro-enterprise.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: '35% Subsidy up to ₹10,00,000',
                    capacityNeeded: 'Food preparation setup',
                    requiredSkills: ['Traditional Pickle Curing', 'Spice Blending', 'Natural Fermentation', 'Baking'],
                    eligibleCategories: ['Food Production'],
                    eligibilityCriteria: ['Existing micro food processing enterprise', 'One District One Product (ODOP) focus preferred'],
                    keyBenefits: ['35% capital expenditure subsidy for stainless machinery & automatic packaging', 'Free food safety, packaging, and branding technical support', 'Direct credit linkage through commercial banks'],
                    deadline: '2026-12-31',
                    actionLabel: 'Apply for PMFME Food Subsidy',
                    officialUrl: 'https://pmfme.mofpi.gov.in',
                    tags: ['Food Processing', 'PMFME', '35% Subsidy', 'ODOP'],
                },
                // STREAM 8: SUPPORT PROGRAMS & INCUBATION
                {
                    title: 'Skill India & RSETI Free Entrepreneurship & Digital Marketing Clinic',
                    type: 'support_program',
                    category: 'All',
                    organization: 'National Skill Development Corporation (NSDC) & RSETI',
                    description: 'Free 6-day residential or online hands-on clinic for home entrepreneurs: mastering smartphone product photography, WhatsApp Business automation, UPI bookkeeping, and GST.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: '100% Free Government Sponsored (Value ₹12,000)',
                    capacityNeeded: 'N/A',
                    requiredSkills: ['Basic smartphone handling'],
                    eligibleCategories: ['All'],
                    eligibilityCriteria: ['Small/home-based entrepreneur or aspiring maker'],
                    keyBenefits: ['Government-recognized certification badge', 'Free photography lighting tent and tripod for product shots', 'Dedicated 6-month business mentor assigned'],
                    deadline: 'Batches start 1st & 15th of every month',
                    actionLabel: 'Enroll in Free Clinic',
                    officialUrl: 'https://skillindia.gov.in',
                    tags: ['Free Training', 'Skill India', 'Digital Marketing', 'Mentorship'],
                },
                {
                    title: 'FSSAI Free Registration & Safe Food Practice Certification Camp',
                    type: 'support_program',
                    category: 'Food Production',
                    organization: 'Food Safety and Standards Authority of India (FSSAI) & UdyamSetu',
                    description: 'Special fast-track camp for home kitchens, pickle makers, and bakers to secure legitimate FSSAI Basic Registration (14-digit license) in 48 hours without paperwork hassle.',
                    locationScope: { isPanIndia: true },
                    estimatedValue: 'Free Compliance & Official License (Value ₹3,500)',
                    capacityNeeded: 'N/A',
                    requiredSkills: ['Clean food handling'],
                    eligibleCategories: ['Food Production'],
                    eligibilityCriteria: ['Annual food sales under ₹12 Lakhs (Petty Food Manufacturer)'],
                    keyBenefits: ['Immediate 14-digit FSSAI registration number', 'Mandatory requirement to unlock Swiggy/Zomato/ONDC and corporate B2B contracts', 'Complimentary hygiene handbook and temperature log kit'],
                    deadline: 'Weekly fast-track processing',
                    actionLabel: 'Get Fast-Track FSSAI',
                    officialUrl: 'https://foscos.fssai.gov.in',
                    tags: ['FSSAI License', 'Food Safety', 'Fast-Track', 'Essential'],
                },
            ];
            await Opportunity.insertMany(initialOpportunities);
            console.log(`✅ Successfully seeded ${initialOpportunities.length} UdyamSetu opportunities across all 8 streams!`);
        }
        else {
            console.log(`ℹ️ Opportunities already exist (${oppCount} items). Skipping re-seed.`);
        }
        console.log('🌟 UdyamSetu database initialization complete!');
    }
    catch (error) {
        console.error('⚠️ Seeding error:', error.message);
    }
}
