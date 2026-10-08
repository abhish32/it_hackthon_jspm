/**
 * Intelligent parser that converts natural language text (from voice transcript or typing)
 * into a structured 6-pillar business profile.
 */
export function extractStructuredProfileFromText(text) {
    const lower = text.toLowerCase();
    // Detect Business Type
    let businessType = 'Handmade Products';
    if (lower.includes('pickle') || lower.includes('food') || lower.includes('snack') || lower.includes('sweet') || lower.includes('masala') || lower.includes('spice') || lower.includes('bakery') || lower.includes('cake') || lower.includes('cook') || lower.includes('papad') || lower.includes('kitchen')) {
        businessType = 'Food Production';
    }
    else if (lower.includes('tailor') || lower.includes('stitch') || lower.includes('embroid') || lower.includes('blouse') || lower.includes('kurti') || lower.includes('saree') || lower.includes('dress') || lower.includes('garment') || lower.includes('sewing') || lower.includes('fabric')) {
        businessType = 'Tailoring & Apparel';
    }
    else if (lower.includes('pottery') || lower.includes('brass') || lower.includes('wood') || lower.includes('clay') || lower.includes('terracotta') || lower.includes('artisan') || lower.includes('craft') || lower.includes('sculpt') || lower.includes('handicraft')) {
        businessType = 'Handicrafts & Art';
    }
    else if (lower.includes('beauty') || lower.includes('makeup') || lower.includes('parlor') || lower.includes('bridal') || lower.includes('mehendi') || lower.includes('hair') || lower.includes('skin')) {
        businessType = 'Beauty & Wellness';
    }
    else if (lower.includes('tutor') || lower.includes('teach') || lower.includes('math') || lower.includes('science') || lower.includes('coaching') || lower.includes('class') || lower.includes('student') || lower.includes('educat')) {
        businessType = 'Education & Tutoring';
    }
    else if (lower.includes('repair') || lower.includes('mobile') || lower.includes('phone') || lower.includes('laptop') || lower.includes('appliance') || lower.includes('electronic') || lower.includes('mechanic')) {
        businessType = 'Repair & Technical';
    }
    // Detect Entrepreneur Name
    let entrepreneurName = 'Entrepreneur';
    const nameMatch = text.match(/(?:i am|my name is|myself|this is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (nameMatch && nameMatch[1]) {
        let raw = nameMatch[1].trim();
        raw = raw.replace(/\b(from|in|operating|based|living|and|at|the)\b.*$/i, '').trim();
        if (raw.length > 1) {
            entrepreneurName = raw;
        }
    }
    else if (lower.includes('sunita')) {
        entrepreneurName = 'Sunita Devi';
    }
    else if (lower.includes('aarav')) {
        entrepreneurName = 'Aarav Sharma';
    }
    else if (lower.includes('pooja')) {
        entrepreneurName = 'Pooja Patil';
    }
    else if (lower.includes('rameshwar')) {
        entrepreneurName = 'Rameshwar Shilpkar';
    }
    else if (lower.includes('meera')) {
        entrepreneurName = 'Dr. Meera Iyer';
    }
    else if (lower.includes('imran')) {
        entrepreneurName = 'Imran Khan';
    }
    // Detect Location (State & City)
    let city = 'Jaipur';
    let state = 'Rajasthan';
    let district = 'Jaipur';
    let pincode = '302001';
    let areaType = 'Urban';
    if (lower.includes('varanasi') || lower.includes('banaras') || lower.includes('kashi')) {
        city = 'Varanasi';
        state = 'Uttar Pradesh';
        district = 'Varanasi';
        pincode = '221001';
    }
    else if (lower.includes('lucknow')) {
        city = 'Lucknow';
        state = 'Uttar Pradesh';
        district = 'Lucknow';
        pincode = '226001';
    }
    else if (lower.includes('pune')) {
        city = 'Pune';
        state = 'Maharashtra';
        district = 'Pune';
        pincode = '411001';
    }
    else if (lower.includes('bengaluru') || lower.includes('bangalore')) {
        city = 'Bengaluru';
        state = 'Karnataka';
        district = 'Bengaluru Urban';
        pincode = '560001';
    }
    else if (lower.includes('hyderabad')) {
        city = 'Hyderabad';
        state = 'Telangana';
        district = 'Hyderabad';
        pincode = '500001';
    }
    else if (lower.includes('mumbai')) {
        city = 'Mumbai';
        state = 'Maharashtra';
        district = 'Mumbai Suburban';
        pincode = '400001';
    }
    else if (lower.includes('delhi')) {
        city = 'Delhi';
        state = 'Delhi NCR';
        district = 'New Delhi';
        pincode = '110001';
    }
    else if (lower.includes('jaipur')) {
        city = 'Jaipur';
        state = 'Rajasthan';
        district = 'Jaipur';
        pincode = '302001';
    }
    if (lower.includes('village') || lower.includes('rural') || lower.includes('gram')) {
        areaType = 'Rural';
    }
    else if (lower.includes('town') || lower.includes('tehsil') || lower.includes('semi-urban')) {
        areaType = 'Semi-Urban';
    }
    // Detect Capacity
    let monthlyVolume = '50 units / month';
    let unit = 'units';
    let leadTimeDays = 3;
    let peakCapacity = '100 units / month';
    const capMatch = text.match(/(\d+)\s*(kg|kilos|pieces|pcs|units|litres|orders|students|clients|repairs|suits|sarees)(?:\s*(?:per|\/|a)\s*(?:month|week|day))?/i);
    if (capMatch) {
        const qty = capMatch[1];
        unit = capMatch[2].toLowerCase();
        monthlyVolume = `${qty} ${unit} / month`;
        peakCapacity = `${Math.round(parseInt(qty) * 1.8)} ${unit} / month`;
    }
    else if (businessType === 'Food Production') {
        monthlyVolume = '80 kg / month';
        unit = 'kg';
        peakCapacity = '150 kg / month';
    }
    else if (businessType === 'Tailoring & Apparel') {
        monthlyVolume = '40 pieces / month';
        unit = 'pieces';
        peakCapacity = '75 pieces / month';
    }
    else if (businessType === 'Handicrafts & Art') {
        monthlyVolume = '60 artifacts / month';
        unit = 'artifacts';
        peakCapacity = '120 artifacts / month';
    }
    if (lower.includes('turnaround') || lower.includes('lead time') || lower.includes('days')) {
        const daysMatch = text.match(/(\d+)\s*days?/i);
        if (daysMatch) {
            leadTimeDays = parseInt(daysMatch[1]);
        }
    }
    // Detect Skills
    const skills = [];
    if (businessType === 'Food Production') {
        skills.push('Traditional Pickle Curing', 'Spice Blending', 'Natural Fermentation', 'Sun-drying', 'Hygienic Preservation');
    }
    else if (businessType === 'Tailoring & Apparel') {
        skills.push('Custom Blouse Stitching', 'Zari & Zardozi Hand Embroidery', 'Pattern Cutting', 'Bridal Alteration', 'Fabric Sourcing');
    }
    else if (businessType === 'Handicrafts & Art') {
        skills.push('Terracotta Clay Modeling', 'Traditional Brass Engraving', 'Wheel Throwing', 'Natural Pigment Glazing', 'Heritage Crafting');
    }
    else if (businessType === 'Beauty & Wellness') {
        skills.push('Bridal Makeup Artistry', 'Herbal Facial Treatments', 'Traditional Mehendi Art', 'Hair Styling', 'Organic Skincare Formulation');
    }
    else if (businessType === 'Education & Tutoring') {
        skills.push('STEM Concept Coaching', 'Bilingual Mathematics Tutoring', 'Exam Preparation Mentorship', 'Foundational Literacy', 'Interactive Pedagogy');
    }
    else if (businessType === 'Repair & Technical') {
        skills.push('Smartphone Motherboard Diagnostics', 'SMD Micro-Soldering', 'Home Appliance Servicing', 'Display Replacement', 'Circuit Board Troubleshooting');
    }
    else {
        skills.push('Handmade Crafting', 'Eco-friendly Product Formulation', 'Custom Packaging', 'Small Batch Production');
    }
    // Detect Products / Services
    const productsServices = [];
    if (businessType === 'Food Production') {
        productsServices.push({
            name: 'Traditional Rajasthani Mango Pickle',
            category: 'Food - Pickles & Preserves',
            priceRange: '₹280 - ₹350 / kg',
            capacityPerMonth: '50 kg',
            unit: 'kg',
            description: 'Cold-pressed mustard oil cured with heirloom whole spices and no artificial chemicals',
        }, {
            name: 'Stuffed Red Chilli Pickle (Banarasi Mirch)',
            category: 'Food - Pickles & Preserves',
            priceRange: '₹340 - ₹400 / kg',
            capacityPerMonth: '30 kg',
            unit: 'kg',
            description: 'Sun-ripened red chillies hand-stuffed with roasted cumin, fennel, and amchur',
        });
    }
    else if (businessType === 'Tailoring & Apparel') {
        productsServices.push({
            name: 'Handcrafted Bridal Blouse with Zari Work',
            category: 'Apparel - Bespoke Tailoring',
            priceRange: '₹1,500 - ₹3,500 / pc',
            capacityPerMonth: '25 pcs',
            unit: 'pieces',
            description: 'Perfect-fit bridal and festive blouse stitching with custom embroidery and tassel detailing',
        }, {
            name: 'Designer Kurti & Anarkali Tailoring',
            category: 'Apparel - Custom Stitching',
            priceRange: '₹800 - ₹1,800 / pc',
            capacityPerMonth: '30 pcs',
            unit: 'pieces',
            description: 'Contemporary and traditional ethnic suits tailored with premium lining',
        });
    }
    else if (businessType === 'Handicrafts & Art') {
        productsServices.push({
            name: 'Hand-carved Terracotta Festive Diyas & Pots',
            category: 'Handicrafts - Pottery',
            priceRange: '₹60 - ₹250 / pc',
            capacityPerMonth: '200 pcs',
            unit: 'pieces',
            description: 'Eco-friendly natural clay diyas and decorative pots handcrafted on potter wheel',
        }, {
            name: 'Etched Brass Temple Bells & Artifacts',
            category: 'Handicrafts - Metalcraft',
            priceRange: '₹450 - ₹1,200 / pc',
            capacityPerMonth: '40 pcs',
            unit: 'pieces',
            description: 'Traditional solid brass decorative pieces etched with spiritual floral motifs',
        });
    }
    else {
        productsServices.push({
            name: `${entrepreneurName}'s Signature Offering`,
            category: businessType,
            priceRange: '₹250 - ₹1,500',
            capacityPerMonth: monthlyVolume,
            unit,
            description: `High-quality specialized ${businessType.toLowerCase()} handcrafted with local raw materials`,
        });
    }
    // Detect Resources & Equipment
    const equipment = [];
    if (lower.includes('machine') || lower.includes('sewing') || lower.includes('loom')) {
        equipment.push('Industrial Sewing Machine', 'Interlock Machine');
    }
    if (lower.includes('grinder') || lower.includes('mixer') || lower.includes('blender') || lower.includes('mortar')) {
        equipment.push('Heavy-duty Mixer & Grinder', 'Stone Mortar & Pestle');
    }
    if (lower.includes('tools') || lower.includes('soldering') || lower.includes('meter')) {
        equipment.push('Digital Multimeter', 'Soldering Station & Microscope');
    }
    if (equipment.length === 0) {
        if (businessType === 'Food Production')
            equipment.push('Stainless steel food-grade drums', 'Vacuum sealer', 'Precision weighing scale');
        else if (businessType === 'Tailoring & Apparel')
            equipment.push('Motorized sewing machine', 'Embroidery frames', 'Steam press');
        else if (businessType === 'Handicrafts & Art')
            equipment.push('Potter wheel', 'Clay kiln', 'Carving chisels');
        else
            equipment.push('Standard professional toolkit', 'Inspection instruments');
    }
    let workforceCount = 2;
    if (lower.includes('alone') || lower.includes('myself') || lower.includes('solo')) {
        workforceCount = 1;
    }
    else if (lower.includes('sister') || lower.includes('brother') || lower.includes('wife') || lower.includes('husband') || lower.includes('family')) {
        workforceCount = 2;
    }
    else if (lower.includes('workers') || lower.includes('helpers') || lower.includes('team')) {
        const workerMatch = text.match(/(\d+)\s*(?:workers|helpers|staff|assistants)/i);
        if (workerMatch)
            workforceCount = parseInt(workerMatch[1]);
    }
    // Detect Business Goals
    const businessGoals = [];
    if (lower.includes('bulk') || lower.includes('hotel') || lower.includes('restaurant') || lower.includes('b2b') || lower.includes('boutique')) {
        businessGoals.push('Establish recurring bulk supply partnerships with B2B commercial buyers');
    }
    if (lower.includes('loan') || lower.includes('mudra') || lower.includes('money') || lower.includes('finance') || lower.includes('capital') || lower.includes('subsidy')) {
        businessGoals.push('Obtain ₹50,000 - ₹2,00,000 PMMY Mudra / PM Vishwakarma collateral-free working capital loan');
    }
    if (lower.includes('ondc') || lower.includes('online') || lower.includes('amazon') || lower.includes('website') || lower.includes('marketplace')) {
        businessGoals.push('Onboard products directly onto ONDC (Open Network for Digital Commerce) & e-marketplaces');
    }
    if (lower.includes('fssai') || lower.includes('license') || lower.includes('packaging') || lower.includes('certificate')) {
        businessGoals.push('Secure regulatory certifications (FSSAI/Udyam) and upgrade to eco-friendly retail packaging');
    }
    if (businessGoals.length === 0) {
        businessGoals.push('Connect with institutional bulk buyers and corporate gifting contracts', 'Access low-interest government financing for tools upgradation', 'Expand regional customer visibility through UdyamSetu');
    }
    // Business Name
    let businessName = `${entrepreneurName}'s ${businessType.split(' ')[0]} Enterprise`;
    if (businessType === 'Food Production')
        businessName = `${entrepreneurName}'s Heritage Kitchen`;
    else if (businessType === 'Tailoring & Apparel')
        businessName = `${entrepreneurName} Couture & Tailoring`;
    else if (businessType === 'Handicrafts & Art')
        businessName = `${entrepreneurName} Shilp Kala Kendra`;
    // Recommendations
    const immediateRecommendations = [
        `Complete your Udyam Registration (free online in 10 mins) to unlock priority government schemes.`,
        `Sync catalog to ONDC via UdyamSetu's 1-click bridge to reach millions of buyers without middleman commissions.`,
        `Explore matched B2B and bulk order opportunities in ${city} requiring your ${monthlyVolume} capacity.`,
    ];
    return {
        entrepreneurName,
        businessName,
        tradeName: businessName,
        businessType,
        skills,
        productsServices,
        locationDetails: {
            address: `${city}, ${state}`,
            city,
            district,
            state,
            pincode,
            areaType,
            serviceRadiusKm: 50,
        },
        capacityDetails: {
            monthlyVolume,
            unit,
            leadTimeDays,
            peakCapacity,
            scalabilityNotes: `Scalable by ${workforceCount > 1 ? 'adding part-time helpers' : 'partnering with adjacent micro-units'}`,
        },
        resourceDetails: {
            equipment,
            workspaceType: 'Dedicated Home Workshop / Space',
            workspaceAreaSqFt: 180,
            workforceCount,
            hasDeliveryVehicle: lower.includes('bike') || lower.includes('scooter') || lower.includes('car'),
            rawMaterialAccess: 'Local mandis & wholesale suppliers',
        },
        businessGoals,
        readinessScore: 84,
        confidence: 94,
        summary: `Structured profile for ${entrepreneurName} operating in ${city}, ${state} specializing in ${businessType}. Monthly throughput: ${monthlyVolume}. Ready for automated matching across all 8 UdyamSetu channels.`,
        immediateRecommendations,
    };
}
/**
 * Generates an automated, professional B2B quotation / pitch proposal
 * tailored to a specific opportunity and entrepreneur profile.
 */
export function generateB2BPitch(opportunity, profile) {
    const pName = profile.entrepreneurName || 'Artisan';
    const bName = profile.businessName || 'Micro-Enterprise';
    const city = profile.locationDetails?.city || profile.district || 'India';
    const state = profile.locationDetails?.state || profile.state || '';
    const capacity = profile.capacityDetails?.monthlyVolume || 'Standard capacity';
    const turnaround = `${profile.capacityDetails?.leadTimeDays || 3} days`;
    const subject = `Expression of Interest & Proposal: ${opportunity.title} — ${bName}`;
    const salutation = `Dear Procurement Team / ${opportunity.organization},`;
    const executiveSummary = `I am writing to formally express our keen interest in fulfilling "${opportunity.title}". Operating as ${bName} based out of ${city}, ${state}, we specialize in authentic, handcrafted ${profile.businessType.toLowerCase()} produced under strict quality control.`;
    const offeredCapacity = `Our dedicated setup can readily commit up to ${capacity} specifically earmarked for your order requirements, with an immediate lead time of ${turnaround}.`;
    const qualityAssurance = `Every batch is produced using proven artisanal techniques (${profile.skills.slice(0, 3).join(', ')}). We ensure 100% batch consistency, authentic materials, and sanitary packaging ready for retail or hospitality presentation.`;
    const pricingProposal = `We offer competitive direct-maker wholesale pricing designed for institutional partnerships, eliminating distributor markups while preserving genuine craftsmanship.`;
    const callToAction = `We welcome the opportunity to courier a complimentary sample box to your office in ${opportunity.locationScope.city || 'your city'} this week. Please let us know the preferred delivery address or convenient time for a brief discussion.`;
    return {
        recipientTitle: `Procurement Officer, ${opportunity.organization}`,
        subject,
        salutation,
        executiveSummary,
        offeredCapacity,
        turnaroundTime: turnaround,
        qualityAssurance,
        pricingProposal,
        callToAction,
    };
}
/**
 * Conversational advisor that answers queries from small entrepreneurs.
 */
export function handleAdvisorChat(query, profile) {
    const q = query.toLowerCase();
    const bType = profile.businessType || 'home enterprise';
    const city = profile.locationDetails?.city || profile.district || 'your city';
    if (q.includes('pitch') || q.includes('hotel') || q.includes('b2b') || q.includes('corporate') || q.includes('buyer')) {
        return {
            replyText: `Here is the winning strategy for **${profile.businessName}** to secure B2B hotel and corporate buyers for your ${bType.toLowerCase()}:`,
            actionableSteps: [
                `**Curate a Tasting / Sample Kit**: Create compact 100g/trial samples with clean, branded labeling. Hotels and cafes decide on taste and packaging aesthetics.`,
                `**Highlight Direct Maker Authenticity**: Commercial buyers love telling their guests that products are "locally handcrafted in ${city} by traditional makers".`,
                `**Guarantee Punctual Delivery**: Commit to a firm lead time (e.g. ${profile.capacityDetails?.leadTimeDays || 3} days) and propose bi-weekly delivery cycles to manage shelf life.`,
                `**Offer GST / Udyam Invoicing**: Ensure your Udyam Registration number (${profile.registrations?.udyam || 'Free on udyamregistration.gov.in'}) is on your invoice.`,
            ],
            suggestedQuestions: [
                'How do I calculate wholesale pricing for bulk orders?',
                'Which government schemes help with packaging machines?',
                'How can I get listed on ONDC directly?',
            ],
            relevantSchemesOrMarketplaces: ['ONDC Network', 'GeM Direct Purchase', 'PMFME Food Processing Subsidy'],
        };
    }
    if (q.includes('loan') || q.includes('finance') || q.includes('mudra') || q.includes('vishwakarma') || q.includes('money')) {
        return {
            replyText: `As a home-based creator in ${profile.locationDetails?.state || 'India'}, here are the most accessible zero-collateral financing options:`,
            actionableSteps: [
                `**Pradhan Mantri MUDRA Yojana (PMMY) — Shishu Category**: Provides loans up to ₹50,000 at low interest with zero collateral. Ideal for buying a ₹30k machine.`,
                `**PM Vishwakarma Scheme**: If you practice traditional trades (tailoring, pottery, carpentry, metalcraft), you receive ₹15,000 free toolkit grant + ₹1,00,000 loan at 5% subsidized interest (tranche 1).`,
                `**PMFME (Micro Food Enterprises)**: If making pickles, spices, or snacks, you get a 35% capital subsidy up to ₹10 Lakhs on food processing equipment.`,
                `**PMEGP (Prime Minister Employment Generation Programme)**: Offers 25% to 35% government subsidy for micro-manufacturing setups.`,
            ],
            suggestedQuestions: [
                'What documents are needed for Mudra Shishu loan?',
                'Am I eligible for PM Vishwakarma toolkit grant?',
                'How do I apply for the PMFME 35% subsidy?',
            ],
            relevantSchemesOrMarketplaces: ['PM Vishwakarma', 'PMMY Mudra Loan', 'PMFME Scheme', 'Stand-Up India'],
        };
    }
    if (q.includes('ondc') || q.includes('marketplace') || q.includes('amazon') || q.includes('online')) {
        return {
            replyText: `ONDC (Open Network for Digital Commerce) is the ultimate game changer for small entrepreneurs like **${profile.entrepreneurName}**. Here is how to unlock it:`,
            actionableSteps: [
                `**No 30% Middleman Cut**: Unlike conventional aggregators, ONDC operates on an open protocol with minimal commissions (usually 3-5%).`,
                `**One Catalog, Multiple Buyer Apps**: Upload your products once, and customers on Paytm, Magicpin, Mystore, and Pincode can all discover you.`,
                `**Integrated Logistics**: Network logistics providers (Dunzo, Shadowfax, Delhivery) pick up directly from your doorstep in ${city}.`,
                `**Use UdyamSetu's 1-Click Bridge**: We map your products, images, and price directly to ONDC-compatible schemas automatically.`,
            ],
            suggestedQuestions: [
                'Do I need GST to sell on ONDC?',
                'How does doorstep delivery work on ONDC?',
                'How do I register for Udyam certificate?',
            ],
            relevantSchemesOrMarketplaces: ['ONDC Network', 'Amazon Saheli', 'GeM Portal', 'Flipkart Samarth'],
        };
    }
    // Default Guidance
    return {
        replyText: `I am your **UdyamSetu AI Advisor**. I have reviewed your profile for **${profile.businessName}** (${bType}, ${city}). Here is your immediate growth roadmap:`,
        actionableSteps: [
            `Your current capacity of ${profile.capacityDetails?.monthlyVolume || '50 units'} fits 4 high-match B2B and bulk opportunities right now.`,
            `We recommend generating a formal sample pitch for local businesses using the 1-Click Pitch Generator.`,
            `Check the Financing tab for Mudra Shishu and PM Vishwakarma subsidies matched to your category.`,
        ],
        suggestedQuestions: [
            'How do I pitch to B2B buyers and hotels?',
            'Which government loans require zero collateral?',
            'How do I start selling on ONDC?',
        ],
        relevantSchemesOrMarketplaces: ['PMMY Mudra Yojana', 'ONDC Network', 'PM Vishwakarma'],
    };
}
