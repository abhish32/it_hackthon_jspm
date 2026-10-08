import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ExtractedStructuredProfile, ChatMessage } from '../types';

export const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'extractor' | 'advisor'>('extractor');

  // Natural Language to Profile State
  const [nlInput, setNlInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedProfile, setExtractedProfile] = useState<ExtractedStructuredProfile | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // Conversational Advisor State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Namaste! I am your UdyamSetu AI Business Advisor. I can help you convert your business description into a structured profile, generate B2B pitches, calculate bulk order prices, find Mudra loans, or register on ONDC. How can I assist you today?',
      timestamp: 'Just now',
      suggestions: [
        'How do I pitch to hotel chains & B2B buyers?',
        'Which government schemes offer machinery subsidies?',
        'How do I start selling on ONDC without high commissions?',
        'What documents are needed for Mudra loan?',
      ],
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Pre-loaded realistic scenarios
  const sampleScenarios = [
    {
      label: 'Home Pickle Maker (Jaipur)',
      text: 'I am Sunita from Jaipur, Rajasthan. I prepare authentic handmade Rajasthani mango pickles and stuffed red chilli pickles in my dedicated home kitchen. I have stainless steel drums, stone grinders, and a vacuum sealer. My sister and I can make about 80 kg of pickles per month with a 3-day turnaround. We want to supply to heritage hotels and restaurants, get a 50,000 Mudra loan for an electric jar capping machine, and sell on ONDC.',
    },
    {
      label: 'Boutique Tailor & Embroiderer (Lucknow)',
      text: 'My name is Aarav Sharma from Hazratganj, Lucknow. I run a home tailoring studio specializing in custom bridal blouse stitching, zari zardozi hand embroidery, and designer kurtis. I have two motorized sewing machines, an overlock machine, and wooden adda frames. With two assistant tailors, we stitch 60 pieces a month with 5 days lead time. We want contract stitching orders from designer boutiques, apply for PM Vishwakarma for the 15k toolkit, and sell on Amazon Saheli.',
    },
    {
      label: 'Organic Soap & Candle Maker (Pune)',
      text: 'I am Pooja Patil from Kothrud, Pune. I formulate cold-processed natural goat milk soaps and hand-poured soy wax scented candles from my home workshop. I have silicone loaf molds, immersion blenders, and curing racks. I produce 500 units monthly with 7 days turnaround. I want bulk wedding favor and corporate festive gifting orders, and want to partner with a handicraft basket artisan to create bundled hampers.',
    },
    {
      label: 'Terracotta & Brass Artisan (Varanasi)',
      text: 'I am Rameshwar Shilpkar from Ramnagar, Varanasi. We are a family artisan unit making handcrafted terracotta temple diyas, earthen pots, and hand-engraved solid brass bells. We have electric potter wheels and a wood-fired kiln. Our family of four crafts 550 units monthly. We want to apply for PM Vishwakarma scheme for tools and low interest loan, and supply to temple trusts and state tourism shops via GeM portal.',
    },
    {
      label: 'Smartphone & Appliance Repair (Hyderabad)',
      text: 'I am Imran Khan from Mehdipatnam, Hyderabad. I provide doorstep smartphone display repairs, motherboard chip diagnostics, and inverter repairs. I have a digital multimeter, SMD soldering station, and travel toolkit. I complete around 125 repairs a month with 1 day turnaround. I want annual maintenance contracts with residential societies and a 50k Mudra loan for a thermal camera.',
    },
  ];

  const handleRunExtraction = async (textToExtract?: string) => {
    const text = textToExtract || nlInput;
    if (!text.trim()) return;

    setIsExtracting(true);
    setAppliedSuccess(false);

    try {
      const extracted = await api.convertProfileFromText(text);
      setExtractedProfile(extracted);
    } catch (err) {
      console.error('Error extracting profile:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!extractedProfile) return;
    try {
      await api.updateBusinessProfile({
        entrepreneurName: extractedProfile.entrepreneurName,
        businessName: extractedProfile.businessName,
        tradeName: extractedProfile.tradeName,
        businessType: extractedProfile.businessType as any,
        skills: extractedProfile.skills,
        productsServices: extractedProfile.productsServices,
        locationDetails: extractedProfile.locationDetails,
        capacityDetails: extractedProfile.capacityDetails,
        resourceDetails: extractedProfile.resourceDetails,
        businessGoals: extractedProfile.businessGoals,
        readinessScore: extractedProfile.readinessScore,
        location: `${extractedProfile.locationDetails.city}, ${extractedProfile.locationDetails.state}`,
        district: extractedProfile.locationDetails.district,
        state: extractedProfile.locationDetails.state,
      });

      setAppliedSuccess(true);
      window.dispatchEvent(new Event('udyamsetu_profile_updated'));
      setTimeout(() => {
        navigate('/business');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleVoiceSimulate = () => {
    if (isRecording) {
      setIsRecording(false);
      return;
    }

    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const randomScenario = sampleScenarios[0];
      setNlInput(randomScenario.text);
      handleRunExtraction(randomScenario.text);
    }, 2500);
  };

  const handleSendChat = async (queryText?: string) => {
    const q = queryText || chatInput;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await api.askAdvisor(q);
      const assistantMsg: ChatMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: response.replyText,
        timestamp: 'Just now',
        actionableSteps: response.actionableSteps,
        suggestions: response.suggestedQuestions,
        relevantSchemes: response.relevantSchemesOrMarketplaces,
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat advisor error:', err);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              </span>
              <h1 className="text-xl font-bold text-gray-900">UdyamSetu AI Business Assistant</h1>
            </div>
            <p className="text-xs text-gray-500">
              Transform unstructured natural language descriptions into a verified 6-pillar business profile, or receive conversational guidance on B2B contracts, schemes, and marketplaces.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('extractor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'extractor'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">transform</span>
              Voice/Text to Profile
            </button>
            <button
              onClick={() => setActiveTab('advisor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'advisor'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">forum</span>
              Conversational Advisor
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: NATURAL LANGUAGE TO PROFILE EXTRACTOR */}
      {activeTab === 'extractor' && (
        <div className="space-y-6">
          {/* Input Box Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600 text-[20px]">speech_to_text</span>
                Describe Your Enterprise in Plain Language
              </h2>
              <span className="text-[11px] text-gray-400">English, Hindi or Hinglish</span>
            </div>

            {/* Quick Scenario Chips */}
            <div className="mb-4">
              <span className="text-[11px] font-semibold text-gray-500 block mb-2">
                Or click a pre-filled grassroots scenario:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleScenarios.map((scen, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setNlInput(scen.text);
                      handleRunExtraction(scen.text);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 border border-gray-200 hover:border-emerald-300 font-medium text-gray-700 transition-all"
                  >
                    {scen.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Textarea */}
            <div className="relative mb-4">
              <textarea
                rows={5}
                value={nlInput}
                onChange={(e) => setNlInput(e.target.value)}
                placeholder="Example: I am Sunita from Jaipur. I make traditional handmade mango and red chilli pickles in my kitchen. With my sister, we can make 80 kg a month with a 3-day turnaround. We want to supply to local hotels, get a ₹50,000 Mudra loan for a vacuum jar machine, and sell on ONDC..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-normal text-gray-800 leading-relaxed outline-none"
              />

              {isRecording && (
                <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-white p-4">
                  <div className="w-12 h-12 rounded-full bg-red-600 animate-ping mb-3"></div>
                  <p className="text-sm font-bold">Listening to voice audio...</p>
                  <p className="text-xs text-emerald-200 mt-1">Transcribing speech in real-time</p>
                </div>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleVoiceSimulate}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                  isRecording
                    ? 'bg-red-50 text-red-700 border-red-300'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                <span className="material-symbols-outlined text-red-600 text-[18px]">mic</span>
                {isRecording ? 'Recording (Click to stop)...' : 'Simulate Voice Speech Input'}
              </button>

              <button
                onClick={() => handleRunExtraction()}
                disabled={isExtracting || !nlInput.trim()}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isExtracting ? 'sync' : 'auto_fix_high'}
                </span>
                {isExtracting ? 'Analyzing Narrative with AI...' : 'Convert to Structured Profile'}
              </button>
            </div>
          </div>

          {/* Extracted Structured Profile Preview */}
          {extractedProfile && (
            <div className="bg-white rounded-2xl p-6 border-2 border-emerald-500 shadow-lg space-y-6">
              {/* Header Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                      ✓ Profile Parsed Successfully
                    </span>
                    <span className="text-xs text-gray-500">
                      AI Confidence: <strong className="text-emerald-700">{extractedProfile.confidence}%</strong>
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mt-1">
                    {extractedProfile.businessName} • {extractedProfile.entrepreneurName}
                  </h2>
                  <p className="text-xs text-gray-600">{extractedProfile.summary}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={handleApplyToProfile}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Apply Directly to My Profile
                  </button>
                </div>
              </div>

              {appliedSuccess && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600 text-[20px]">task_alt</span>
                  <span>
                    Successfully applied to your live business profile! Redirecting to Business View...
                  </span>
                </div>
              )}

              {/* The 6 Pillars Breakdown Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Pillar 1: Skills */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">psychology</span>
                    1. Extracted Skills & Techniques
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {extractedProfile.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-800 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pillar 2: Products & Services */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">inventory</span>
                    2. Products & Services Catalog
                  </div>
                  <div className="space-y-1.5">
                    {extractedProfile.productsServices.map((prod, idx) => (
                      <div key={idx} className="p-2 rounded bg-white border border-gray-200 text-xs">
                        <div className="font-bold text-gray-900">{prod.name}</div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          {prod.priceRange} • {prod.capacityPerMonth}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pillar 3: Location Details */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">location_on</span>
                    3. Location & Area Scope
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <div>
                      <strong>City / District:</strong> {extractedProfile.locationDetails.city},{' '}
                      {extractedProfile.locationDetails.state}
                    </div>
                    <div>
                      <strong>Area Type:</strong> {extractedProfile.locationDetails.areaType}
                    </div>
                    <div>
                      <strong>Fulfillment Radius:</strong> {extractedProfile.locationDetails.serviceRadiusKm} km
                    </div>
                  </div>
                </div>

                {/* Pillar 4: Capacity */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">speed</span>
                    4. Production Capacity
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <div>
                      <strong>Monthly Volume:</strong>{' '}
                      <span className="font-bold text-emerald-700">
                        {extractedProfile.capacityDetails.monthlyVolume}
                      </span>
                    </div>
                    <div>
                      <strong>Batch Lead Time:</strong> {extractedProfile.capacityDetails.leadTimeDays} days
                    </div>
                    <div>
                      <strong>Peak Capacity:</strong> {extractedProfile.capacityDetails.peakCapacity}
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {extractedProfile.capacityDetails.scalabilityNotes}
                    </div>
                  </div>
                </div>

                {/* Pillar 5: Available Resources */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">build</span>
                    5. Available Resources & Tools
                  </div>
                  <div className="text-xs space-y-1 text-gray-700">
                    <div>
                      <strong>Workforce:</strong> {extractedProfile.resourceDetails.workforceCount} helpers
                    </div>
                    <div>
                      <strong>Workspace:</strong> {extractedProfile.resourceDetails.workspaceType}
                    </div>
                    <div>
                      <strong>Key Equipment:</strong>{' '}
                      {extractedProfile.resourceDetails.equipment.slice(0, 3).join(', ')}
                    </div>
                  </div>
                </div>

                {/* Pillar 6: Business Goals */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2 text-xs font-bold text-gray-900">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">flag</span>
                    6. Business Goals
                  </div>
                  <ul className="text-xs space-y-1 text-gray-700 list-disc list-inside">
                    {extractedProfile.businessGoals.map((g, idx) => (
                      <li key={idx} className="truncate">
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Immediate Recommendations */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-950 block mb-2">
                  Immediate AI Next Steps:
                </span>
                <ul className="text-xs text-emerald-900 space-y-1">
                  {extractedProfile.immediateRecommendations.map((r, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px] text-emerald-600">arrow_right</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONVERSATIONAL ADVISOR */}
      {activeTab === 'advisor' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages Log */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  </div>
                )}

                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Actionable Steps List if provided */}
                  {msg.actionableSteps && msg.actionableSteps.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <span className="text-xs font-bold text-gray-900 block">Recommended Action Steps:</span>
                      {msg.actionableSteps.map((step, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-emerald-50/60 text-xs text-gray-800 font-normal">
                          {step}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestion Chips */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                      {msg.suggestions.map((sugg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendChat(sugg)}
                          className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-100 text-gray-700 hover:text-emerald-900 font-medium transition-all"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                    ME
                  </div>
                )}
              </div>
            ))}

            {isChatLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-200 text-xs text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  AI is reviewing your business profile and formulating advice...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask how to pitch to hotels, calculate bulk pricing, get Mudra loans, or onboard on ONDC..."
                className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs sm:text-sm outline-none"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[16px]">send</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
