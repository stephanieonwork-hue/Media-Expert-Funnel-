import React, { useState, useMemo } from 'react';
import { Brain, TrendingUp, RefreshCw, Search, RotateCcw, Shield, ChevronRight, AlertTriangle, CheckCircle, Info, BarChart3, Target, Zap, Settings, Edit3, HelpCircle } from 'lucide-react';

const MemoryScoreFramework = () => {
  const [activeView, setActiveView] = useState('input');
  const [activeStage, setActiveStage] = useState(0);
  
  // Brand Configuration
  const [brandConfig, setBrandConfig] = useState({
    brandName: '',
    category: '',
    reportPeriod: 'January 2026',
    competitors: ['', '', '']
  });

  // YouGov Data Inputs for each stage
  const [yougovData, setYougovData] = useState({
    createMemory: {
      brandAwareness: 50,
      firstTimeConsideration: 30,
      unpromptedRecall: 20,
      categoryBenchmark: 45
    },
    expandMemory: {
      brandAssociationsCount: 5,
      categoriesPurchased: 2,
      usageOccasions: 3,
      categoryBenchmark: 6
    },
    strengthenMemory: {
      brandLoyalty: 60,
      repeatPurchase: 45,
      favourability: 55,
      promptedRecall: 70,
      categoryBenchmark: 55
    },
    retrieveMemory: {
      topOfMindAwareness: 15,
      purchaseIntent: 25,
      spontaneousRecallPOS: 20,
      categoryBenchmark: 22
    },
    reinstateMemory: {
      lapsedUsage: 30,
      timeSinceLastPurchase: 60,
      reengagementResponse: 15,
      categoryBenchmark: 25
    },
    defendMemory: {
      switchingBehavior: 20,
      competitorAssociationStrength: 40,
      differentiationScore: 55,
      categoryBenchmark: 30
    }
  });

  // Calculate stage scores based on YouGov inputs
  const calculateStageScores = useMemo(() => {
    const scores = {
      createMemory: Math.min(100, Math.max(0, Math.round(
        (yougovData.createMemory.brandAwareness * 0.3 +
        yougovData.createMemory.firstTimeConsideration * 0.3 +
        yougovData.createMemory.unpromptedRecall * 0.4) *
        (1 + (yougovData.createMemory.brandAwareness - yougovData.createMemory.categoryBenchmark) / 100)
      ))),
      expandMemory: Math.min(100, Math.max(0, Math.round(
        ((yougovData.expandMemory.brandAssociationsCount / 10) * 100 * 0.4 +
        (yougovData.expandMemory.categoriesPurchased / 5) * 100 * 0.3 +
        (yougovData.expandMemory.usageOccasions / 8) * 100 * 0.3)
      ))),
      strengthenMemory: Math.min(100, Math.max(0, Math.round(
        (yougovData.strengthenMemory.brandLoyalty * 0.3 +
        yougovData.strengthenMemory.repeatPurchase * 0.25 +
        yougovData.strengthenMemory.favourability * 0.25 +
        yougovData.strengthenMemory.promptedRecall * 0.2)
      ))),
      retrieveMemory: Math.min(100, Math.max(0, Math.round(
        (yougovData.retrieveMemory.topOfMindAwareness * 0.4 +
        yougovData.retrieveMemory.purchaseIntent * 0.35 +
        yougovData.retrieveMemory.spontaneousRecallPOS * 0.25) *
        (1 + (yougovData.retrieveMemory.topOfMindAwareness - yougovData.retrieveMemory.categoryBenchmark) / 100)
      ))),
      reinstateMemory: Math.min(100, Math.max(0, Math.round(
        100 - (yougovData.reinstateMemory.lapsedUsage * 0.4 +
        yougovData.reinstateMemory.timeSinceLastPurchase * 0.3) +
        yougovData.reinstateMemory.reengagementResponse * 0.3
      ))),
      defendMemory: Math.min(100, Math.max(0, Math.round(
        (100 - yougovData.defendMemory.switchingBehavior) * 0.35 +
        (100 - yougovData.defendMemory.competitorAssociationStrength) * 0.3 +
        yougovData.defendMemory.differentiationScore * 0.35
      )))
    };
    return scores;
  }, [yougovData]);

  // Overall Memory Score (geometric mean)
  const overallScore = useMemo(() => {
    const scores = Object.values(calculateStageScores);
    const product = scores.reduce((acc, score) => acc * Math.max(score, 1), 1);
    return Math.round(Math.pow(product, 1 / 6));
  }, [calculateStageScores]);

  // Memory stages configuration with DIAGNOSTIC QUESTIONS
  const memoryStages = [
    {
      id: 1,
      key: 'createMemory',
      name: "Create Memory",
      icon: Brain,
      color: "emerald",
      cognitiveProcess: "Initial encoding; formation of brand-category association; entry into awareness set",
      scientificBasis: "Levels of Processing Theory (Craik & Lockhart); Von Restorff Effect",
      marketingObjective: "Build foundational awareness and initial consideration among non-buyers",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "Do consumers know we exist in this category?",
        "Are we breaking through the clutter to register in memory?",
        "Is our brand being encoded for the first time among new prospects?",
        "Are we building awareness faster or slower than category benchmarks?",
        "Is our creative distinctive enough to create initial memory traces?"
      ],
      
      yougovMetrics: [
        { key: "brandAwareness", label: "Brand Awareness", description: "% who have heard of the brand (aided)", unit: "%" },
        { key: "firstTimeConsideration", label: "First-time Consideration", description: "% considering brand for first time", unit: "%" },
        { key: "unpromptedRecall", label: "Unprompted Recall", description: "% who name brand spontaneously", unit: "%" },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Average awareness in category", unit: "%" }
      ],
      diagnosticIndicators: [
        "Low awareness relative to category spend",
        "Low consideration despite awareness (encoding failure)",
        "Weak or absent spontaneous associations"
      ],
      interventions: [
        "Increase reach among non-aware segments",
        "Deploy high-attention, emotionally distinctive creative",
        "Establish clear category membership cues"
      ]
    },
    {
      id: 2,
      key: 'expandMemory',
      name: "Expand Memory",
      icon: TrendingUp,
      color: "blue",
      cognitiveProcess: "Spreading activation; formation of multiple retrieval pathways; CEP linkage",
      scientificBasis: "Associative Network Theory; Ehrenberg-Bass CEP Framework; Hebb's Rule",
      marketingObjective: "Link brand to diverse usage occasions, need-states, and purchase contexts",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "How many Category Entry Points (situations) trigger our brand?",
        "Are we linked to enough occasions to maximize retrieval opportunities?",
        "Do consumers associate us with diverse needs or just one narrow context?",
        "Are we building mental availability breadth or just depth?",
        "What new occasions or need-states could we own?"
      ],
      
      yougovMetrics: [
        { key: "brandAssociationsCount", label: "Brand Associations", description: "Number of attributes linked to brand", unit: "#", max: 10 },
        { key: "categoriesPurchased", label: "Categories Purchased", description: "Cross-category buying behavior", unit: "#", max: 5 },
        { key: "usageOccasions", label: "Usage Occasions", description: "Number of relevant situations", unit: "#", max: 8 },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Avg associations for category leaders", unit: "#", max: 10 }
      ],
      diagnosticIndicators: [
        "Narrow associations (few attributes linked)",
        "Limited usage occasions (single context dependency)",
        "Low cross-category purchase (shallow relationship)"
      ],
      interventions: [
        "Develop campaigns targeting new Category Entry Points",
        "Create occasion-specific messaging variants",
        "Expand brand narrative beyond core positioning"
      ]
    },
    {
      id: 3,
      key: 'strengthenMemory',
      name: "Strengthen Memory",
      icon: RefreshCw,
      color: "violet",
      cognitiveProcess: "Memory consolidation; trace reinforcement; affective encoding maintenance",
      scientificBasis: "Ebbinghaus Forgetting Curve; Spacing Effect; Somatic Marker Hypothesis",
      marketingObjective: "Maintain memory strength among existing buyers; prevent competitive interference",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "Are our existing memory structures decaying or staying strong?",
        "Is our media continuity sufficient to prevent forgetting?",
        "Do customers still feel positively about us (affective memory)?",
        "Are we maintaining loyalty or losing ground to habit erosion?",
        "How quickly do consumers forget us when we stop advertising?"
      ],
      
      yougovMetrics: [
        { key: "brandLoyalty", label: "Brand Loyalty", description: "Commitment to repurchase score", unit: "%" },
        { key: "repeatPurchase", label: "Repeat Purchase", description: "% of buyers who repurchase", unit: "%" },
        { key: "favourability", label: "Favourability", description: "Positive disposition score", unit: "%" },
        { key: "promptedRecall", label: "Prompted Recall", description: "Recognition when prompted", unit: "%" },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Avg loyalty in category", unit: "%" }
      ],
      diagnosticIndicators: [
        "Declining loyalty scores over time",
        "Fading prompted recall (memory trace weakening)",
        "Drop in repeat purchase frequency"
      ],
      interventions: [
        "Maintain continuous media presence (avoid dark periods)",
        "Deploy loyalty-focused messaging to existing customers",
        "Refresh creative while maintaining brand codes"
      ]
    },
    {
      id: 4,
      key: 'retrieveMemory',
      name: "Retrieve Memory",
      icon: Search,
      color: "amber",
      cognitiveProcess: "Cue-dependent retrieval; retrieval fluency; mental availability activation",
      scientificBasis: "Tulving's Encoding Specificity; ACT-R Retrieval Model; Processing Fluency",
      marketingObjective: "Ensure brand is recalled spontaneously when purchase need arises",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "Do consumers think of us when they have a need we can solve?",
        "Are we top-of-mind or buried in the consideration set?",
        "Why do people know us but not buy us? (awareness-action gap)",
        "Is our brand accessible at the moment of decision?",
        "Are the right retrieval cues present in the purchase environment?"
      ],
      
      yougovMetrics: [
        { key: "topOfMindAwareness", label: "Top-of-Mind Awareness", description: "% naming brand first in category", unit: "%" },
        { key: "purchaseIntent", label: "Purchase Intent", description: "Stated likelihood to purchase", unit: "%" },
        { key: "spontaneousRecallPOS", label: "Spontaneous Recall at POS", description: "Unprompted retrieval in context", unit: "%" },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Leader TOM awareness", unit: "%" }
      ],
      diagnosticIndicators: [
        "Not recalled at purchase moment despite awareness",
        "Low purchase intent despite positive perceptions",
        "Encoding-retrieval context mismatch"
      ],
      interventions: [
        "Increase recency of exposure (continuous presence)",
        "Deploy point-of-sale and contextual triggers",
        "Strengthen distinctive brand assets as retrieval cues"
      ]
    },
    {
      id: 5,
      key: 'reinstateMemory',
      name: "Reinstate Memory",
      icon: RotateCcw,
      color: "rose",
      cognitiveProcess: "Memory reactivation; context reinstatement; retrieval pathway restoration",
      scientificBasis: "Context-Dependent Memory; Reconsolidation Theory; State-Dependent Retrieval",
      marketingObjective: "Re-engage lapsed buyers by reactivating dormant brand memories",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "Are we losing customers faster than we're acquiring them?",
        "Can we reactivate dormant memories among lapsed buyers?",
        "What triggers bring former customers back to the brand?",
        "How long before lapsed customers forget us entirely?",
        "Is our win-back messaging reconnecting with stored memories?"
      ],
      
      yougovMetrics: [
        { key: "lapsedUsage", label: "Lapsed Usage Rate", description: "% who stopped purchasing (lower is better)", unit: "%" },
        { key: "timeSinceLastPurchase", label: "Time Since Purchase", description: "Avg days since last buy (lower is better)", unit: "days", max: 365 },
        { key: "reengagementResponse", label: "Re-engagement Response", description: "Response rate to win-back", unit: "%" },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Avg lapse rate in category", unit: "%" }
      ],
      diagnosticIndicators: [
        "High lapse rate (customers leaving faster than acquired)",
        "Long time since last purchase (memory decay progressing)",
        "Low response to re-engagement efforts"
      ],
      interventions: [
        "Develop win-back campaigns with memory reinstatement cues",
        "Use personalized retargeting referencing past behavior",
        "Recreate original purchase context in messaging"
      ]
    },
    {
      id: 6,
      key: 'defendMemory',
      name: "Defend Memory",
      icon: Shield,
      color: "slate",
      cognitiveProcess: "Competitive interference defense; memory inhibition resistance; differentiation",
      scientificBasis: "Interference Theory (McGeoch); Retrieval-Induced Forgetting",
      marketingObjective: "Prevent competitors from overwriting brand memory structures",
      
      // KEY DIAGNOSTIC QUESTIONS
      diagnosticQuestions: [
        "Are competitors overwriting our memory structures?",
        "Is our brand distinctive enough to resist substitution?",
        "Why are customers switching away from us?",
        "Are competitors stealing the associations we built?",
        "Do we own any attributes that competitors can't claim?"
      ],
      
      yougovMetrics: [
        { key: "switchingBehavior", label: "Switching Behavior", description: "% who switched to competitor (lower is better)", unit: "%" },
        { key: "competitorAssociationStrength", label: "Competitor Association", description: "Competitor ownership of key attributes (lower is better)", unit: "%" },
        { key: "differentiationScore", label: "Differentiation Score", description: "Perceived uniqueness vs category", unit: "%" },
        { key: "categoryBenchmark", label: "Category Benchmark", description: "Avg switching rate", unit: "%" }
      ],
      diagnosticIndicators: [
        "High switching to competitors (memory displacement)",
        "Strong competitor associations on key attributes",
        "Weak differentiation (brand interchangeable)"
      ],
      interventions: [
        "Audit competitor messaging and ownership",
        "Strengthen distinctive positioning",
        "Increase SOV during competitive heavy-ups"
      ]
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreStatus = (score) => {
    if (score >= 80) return { label: "Optimal", color: "bg-emerald-100 text-emerald-800" };
    if (score >= 60) return { label: "Healthy", color: "bg-blue-100 text-blue-800" };
    if (score >= 40) return { label: "At-Risk", color: "bg-amber-100 text-amber-800" };
    return { label: "Impaired", color: "bg-red-100 text-red-800" };
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getOverallStatus = (score) => {
    if (score >= 80) return "DOMINANT";
    if (score >= 60) return "ESTABLISHED";
    if (score >= 40) return "VULNERABLE";
    if (score >= 20) return "FRAGILE";
    return "DORMANT";
  };

  const colorClasses = {
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", fill: "bg-emerald-500", light: "bg-emerald-100" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", fill: "bg-blue-500", light: "bg-blue-100" },
    violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", fill: "bg-violet-500", light: "bg-violet-100" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", fill: "bg-amber-500", light: "bg-amber-100" },
    rose: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", fill: "bg-rose-500", light: "bg-rose-100" },
    slate: { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700", fill: "bg-slate-500", light: "bg-slate-100" }
  };

  const handleYougovChange = (stageKey, metricKey, value) => {
    setYougovData(prev => ({
      ...prev,
      [stageKey]: {
        ...prev[stageKey],
        [metricKey]: parseFloat(value) || 0
      }
    }));
  };

  const handleBrandConfigChange = (key, value) => {
    setBrandConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Decay projection calculation
  const decayProjection = useMemo(() => {
    return [
      { week: "Now", score: overallScore },
      { week: "W4", score: Math.round(overallScore * 0.95) },
      { week: "W8", score: Math.round(overallScore * 0.88) },
      { week: "W12", score: Math.round(overallScore * 0.80) },
      { week: "W16", score: Math.round(overallScore * 0.72) },
    ];
  }, [overallScore]);

  // Priority interventions
  const priorityInterventions = useMemo(() => {
    return memoryStages
      .map(stage => ({
        ...stage,
        score: calculateStageScores[stage.key]
      }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3);
  }, [calculateStageScores]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-800">Memory Score™</h1>
              {brandConfig.brandName && (
                <>
                  <span className="text-slate-400">|</span>
                  <span className="text-lg text-emerald-600 font-medium">{brandConfig.brandName}</span>
                </>
              )}
            </div>
            <p className="text-slate-500 text-sm">Brand Diagnostic Framework | Media Experts × YouGov</p>
          </div>
          <div className="flex gap-2">
            {['input', 'framework', 'dashboard'].map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                  activeView === view 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
                }`}
              >
                {view === 'input' && <Edit3 className="w-4 h-4" />}
                {view === 'framework' && <Settings className="w-4 h-4" />}
                {view === 'dashboard' && <BarChart3 className="w-4 h-4" />}
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DATA INPUT VIEW */}
      {activeView === 'input' && (
        <div className="max-w-7xl mx-auto">
          {/* Brand Configuration */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-600" />
              Brand Configuration
            </h2>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand Name</label>
                <input
                  type="text"
                  value={brandConfig.brandName}
                  onChange={(e) => handleBrandConfigChange('brandName', e.target.value)}
                  placeholder="e.g., Pizza Pizza"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={brandConfig.category}
                  onChange={(e) => handleBrandConfigChange('category', e.target.value)}
                  placeholder="e.g., QSR"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Report Period</label>
                <input
                  type="text"
                  value={brandConfig.reportPeriod}
                  onChange={(e) => handleBrandConfigChange('reportPeriod', e.target.value)}
                  placeholder="e.g., January 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Key Competitors</label>
                <input
                  type="text"
                  value={brandConfig.competitors[0]}
                  onChange={(e) => handleBrandConfigChange('competitors', [e.target.value])}
                  placeholder="e.g., Domino's, Pizza Hut"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Live Score Preview */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl p-4 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-sm opacity-80">Live Memory Score</div>
                <div className="text-4xl font-bold">{overallScore}</div>
                <div className="text-sm opacity-80">{getOverallStatus(overallScore)}</div>
              </div>
              <div className="flex gap-3">
                {memoryStages.map((stage) => {
                  const score = calculateStageScores[stage.key];
                  const Icon = stage.icon;
                  return (
                    <div key={stage.id} className="text-center">
                      <div className={`w-10 h-10 rounded-lg ${colorClasses[stage.color].fill} flex items-center justify-center mb-1 opacity-90`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`text-sm font-bold ${score < 40 ? 'text-red-200' : score < 60 ? 'text-amber-200' : 'text-white'}`}>
                        {score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* YouGov Data Input Grid */}
          <div className="grid grid-cols-2 gap-4">
            {memoryStages.map((stage) => {
              const Icon = stage.icon;
              const colors = colorClasses[stage.color];
              const score = calculateStageScores[stage.key];
              const status = getScoreStatus(score);
              
              return (
                <div key={stage.id} className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-4`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${colors.fill} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`font-semibold ${colors.text}`}>{stage.name}</h3>
                        <p className="text-xs text-slate-500">Stage {stage.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                    </div>
                  </div>

                  {/* Questions We're Solving */}
                  <div className="bg-white/70 rounded-lg p-3 mb-3 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-semibold text-slate-700">Questions We're Solving</span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      {stage.diagnosticQuestions.slice(0, 3).map((q, i) => (
                        <div key={i} className="flex items-start gap-1">
                          <span className="text-slate-400">•</span>
                          <span>{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {stage.yougovMetrics.map((metric) => (
                      <div key={metric.key} className="bg-white rounded-lg p-2 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-medium text-slate-700">{metric.label}</label>
                          <span className="text-xs text-slate-400">{metric.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max={metric.max || 100}
                            value={yougovData[stage.key][metric.key]}
                            onChange={(e) => handleYougovChange(stage.key, metric.key, e.target.value)}
                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                          />
                          <input
                            type="number"
                            min="0"
                            max={metric.max || 100}
                            value={yougovData[stage.key][metric.key]}
                            onChange={(e) => handleYougovChange(stage.key, metric.key, e.target.value)}
                            className="w-14 px-2 py-1 text-xs border border-slate-200 rounded text-center focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FRAMEWORK VIEW */}
      {activeView === 'framework' && (
        <>
          {/* Core Premise */}
          <div className="max-w-7xl mx-auto mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 mb-2">The Core Premise</h2>
                  <p className="text-slate-600 leading-relaxed">
                    Most purchasing decisions are <span className="font-semibold text-emerald-700">memory retrieval tasks</span>, not rational evaluations. 
                    Memory Score measures how effectively your brand has been encoded into consumer memory and how easily it can be retrieved at moments of decision.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Memory Stages Navigation */}
          <div className="max-w-7xl mx-auto mb-4">
            <div className="grid grid-cols-6 gap-2">
              {memoryStages.map((stage, index) => {
                const Icon = stage.icon;
                const colors = colorClasses[stage.color];
                const isActive = activeStage === index;
                const score = calculateStageScores[stage.key];
                return (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(index)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isActive 
                        ? `${colors.bg} ${colors.border} shadow-md` 
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${isActive ? colors.fill : "bg-slate-100"} flex items-center justify-center mx-auto mb-1`}>
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                    </div>
                    <div className={`text-xs font-medium text-center ${isActive ? colors.text : "text-slate-600"}`}>
                      {stage.name}
                    </div>
                    <div className={`text-lg font-bold text-center ${getScoreColor(score)}`}>
                      {score}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Stage Detail */}
          <div className="max-w-7xl mx-auto">
            {memoryStages.map((stage, index) => {
              if (activeStage !== index) return null;
              const Icon = stage.icon;
              const colors = colorClasses[stage.color];
              const score = calculateStageScores[stage.key];
              const status = getScoreStatus(score);
              
              return (
                <div key={stage.id} className={`rounded-xl border-2 ${colors.border} ${colors.bg} p-5`}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${colors.fill} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${colors.text}`}>Stage {stage.id}: {stage.name}</h3>
                        <p className="text-slate-600 text-sm mt-1">{stage.marketingObjective}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* QUESTIONS WE'RE SOLVING - Prominent Section */}
                  <div className="bg-white rounded-lg p-4 mb-4 border-2 border-slate-300 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-emerald-600" />
                      <span className="font-semibold text-slate-800">Questions We're Solving</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {stage.diagnosticQuestions.map((question, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm bg-slate-50 rounded-lg p-2">
                          <div className={`w-5 h-5 rounded-full ${colors.fill} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <span className="text-white text-xs font-bold">{i + 1}</span>
                          </div>
                          <span className="text-slate-700">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Scientific Foundation */}
                  <div className="bg-white rounded-lg p-4 mb-4 border border-slate-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500 font-medium">Cognitive Process:</span>
                        <p className="text-slate-700 mt-1">{stage.cognitiveProcess}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Scientific Basis:</span>
                        <p className="text-slate-700 mt-1">{stage.scientificBasis}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* YouGov Signals */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-4 h-4 text-blue-600" />
                        <span className="font-semibold text-slate-800 text-sm">YouGov Signals</span>
                      </div>
                      <div className="space-y-2">
                        {stage.yougovMetrics.map((metric) => (
                          <div key={metric.key} className="flex items-center justify-between text-sm border-b border-slate-100 pb-1">
                            <span className="text-slate-600">{metric.label}</span>
                            <span className="font-semibold text-slate-800">
                              {yougovData[stage.key][metric.key]}{metric.unit === '%' || metric.unit === 'days' ? metric.unit : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Diagnostic Indicators */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span className="font-semibold text-slate-800 text-sm">Warning Signs</span>
                      </div>
                      <div className="space-y-2">
                        {stage.diagnosticIndicators.map((indicator, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                            <span className="text-slate-600">{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interventions */}
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-slate-800 text-sm">Interventions</span>
                      </div>
                      <div className="space-y-2">
                        {stage.interventions.map((intervention, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-600">{intervention}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* DASHBOARD VIEW */}
      {activeView === 'dashboard' && (
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
            {/* Dashboard Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Memory Score™ Diagnostic Report</h2>
                  <p className="text-emerald-100 text-sm">
                    Brand: {brandConfig.brandName || '[Enter Brand]'} | 
                    Category: {brandConfig.category || '[Enter Category]'} | 
                    Period: {brandConfig.reportPeriod}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-emerald-100">Overall Memory Score</div>
                  <div className="text-4xl font-bold text-white">{overallScore}</div>
                  <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                    {getOverallStatus(overallScore)}
                  </span>
                </div>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="p-6">
              {/* Score Breakdown */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Memory Task Breakdown</h3>
                <div className="space-y-3">
                  {memoryStages.map((stage) => {
                    const score = calculateStageScores[stage.key];
                    const status = getScoreStatus(score);
                    const Icon = stage.icon;
                    return (
                      <div key={stage.id} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-lg ${colorClasses[stage.color].fill} flex items-center justify-center`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="w-36 text-sm font-medium text-slate-700">{stage.name}</div>
                        <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getProgressColor(score)} transition-all duration-500`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <div className={`w-10 text-right font-bold ${getScoreColor(score)}`}>
                          {score}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.color} w-20 text-center`}>
                          {status.label}
                        </span>
                        {score < 60 && (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Questions by Priority */}
              <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200 mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                  Key Diagnostic Questions (Priority Areas)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {priorityInterventions.map((stage, i) => {
                    const Icon = stage.icon;
                    return (
                      <div key={stage.id} className="bg-white rounded-lg p-3 border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-6 h-6 ${colorClasses[stage.color].fill} rounded flex items-center justify-center`}>
                            <Icon className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-slate-800 text-sm">{stage.name}</span>
                          <span className={`ml-auto text-sm font-bold ${getScoreColor(stage.score)}`}>{stage.score}</span>
                        </div>
                        <div className="space-y-1">
                          {stage.diagnosticQuestions.slice(0, 2).map((q, qi) => (
                            <p key={qi} className="text-xs text-slate-600 italic">"{q}"</p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Priority Interventions */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600" />
                    Priority Interventions
                  </h3>
                  <div className="space-y-3">
                    {priorityInterventions.map((stage, i) => {
                      const Icon = stage.icon;
                      return (
                        <div key={stage.id} className="bg-white rounded-lg p-3 border border-slate-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                              {i + 1}
                            </span>
                            <Icon className={`w-4 h-4 ${colorClasses[stage.color].text}`} />
                            <span className="font-semibold text-slate-800">{stage.name}</span>
                            <span className={`ml-auto font-bold ${getScoreColor(stage.score)}`}>{stage.score}</span>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{stage.diagnosticIndicators[0]}</p>
                          <div className="flex items-center gap-1 text-sm text-emerald-700">
                            <ChevronRight className="w-4 h-4" />
                            <span>{stage.interventions[0]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Memory Decay Projection */}
                <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Memory Decay Projection
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">Projected Memory Score at current spend level:</p>
                  
                  <div className="flex items-end justify-between h-28 mb-4 px-2">
                    {decayProjection.map((point, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className={`text-sm font-bold ${getScoreColor(point.score)}`}>{point.score}</span>
                        <div 
                          className={`w-10 ${getProgressColor(point.score)} rounded-t transition-all`}
                          style={{ height: `${point.score}%` }}
                        ></div>
                        <span className="text-xs text-slate-500">{point.week}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      Without media reinforcement, Memory Score projected to drop below "Vulnerable" threshold (40) by Week {Math.max(4, Math.ceil(16 * (overallScore - 40) / (overallScore - decayProjection[4].score + 1)))}.
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
                <span>Data Source: YouGov BrandIndex | Omni Behavioral Data</span>
                <span>Generated: {new Date().toLocaleDateString()} | Media Experts</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scientific Foundation Footer */}
      <div className="max-w-7xl mx-auto mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3">Scientific Foundation</h3>
          <div className="grid grid-cols-4 gap-4 text-xs">
            <div className="border-l-2 border-emerald-500 pl-2">
              <div className="font-medium text-slate-800">Kahneman (2011)</div>
              <div className="text-slate-500">Dual-Process Theory</div>
            </div>
            <div className="border-l-2 border-blue-500 pl-2">
              <div className="font-medium text-slate-800">Sharp & Romaniuk</div>
              <div className="text-slate-500">Mental Availability / CEPs</div>
            </div>
            <div className="border-l-2 border-violet-500 pl-2">
              <div className="font-medium text-slate-800">Damasio (1994)</div>
              <div className="text-slate-500">Somatic Marker Hypothesis</div>
            </div>
            <div className="border-l-2 border-amber-500 pl-2">
              <div className="font-medium text-slate-800">Ebbinghaus (1885)</div>
              <div className="text-slate-500">Memory Decay Curve</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryScoreFramework;
