import React, { useState, useMemo, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Memory Score™ Diagnostic Tool - Media Experts (Omnicom Media Canada)
// A proprietary brand diagnostic measuring memory encoding, retrieval, and competitive defense

const MemoryScoreDiagnostic = () => {
  const [activeView, setActiveView] = useState('input');
  const [activeStage, setActiveStage] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const dashboardRef = useRef(null);

  // Brand Configuration
  const [brandConfig, setBrandConfig] = useState({
    brandName: 'Sample Brand',
    category: 'Consumer Packaged Goods',
    reportPeriod: 'Q4 2025',
    competitor: 'Competitor A'
  });

  // Stage definitions with all metadata
  const stages = [
    {
      id: 'create',
      name: 'CREATE MEMORY',
      shortName: 'Create',
      color: 'emerald',
      bgColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-500',
      lightBg: 'bg-emerald-50',
      hex: '#10b981',
      cognitiveProcess: 'Initial encoding; formation of brand-category association; entry into awareness set',
      questions: [
        'Do consumers know we exist in this category?',
        'Are we breaking through the clutter to register in memory?',
        'Is our brand being encoded for the first time among new prospects?',
        'Are we building awareness faster or slower than category benchmarks?',
        'Is our creative distinctive enough to create initial memory traces?'
      ],
      signals: [
        { key: 'awareness', label: 'Brand Awareness (%)', benchmark: 65 },
        { key: 'consideration', label: 'First-time Consideration (%)', benchmark: 35 },
        { key: 'recall', label: 'Unprompted Recall (%)', benchmark: 25 }
      ],
      diagnosticIndicators: [
        'Low awareness relative to category spend',
        'Low consideration despite awareness (encoding failure)',
        'Weak or absent spontaneous associations'
      ],
      interventions: [
        'Increase reach among non-aware segments',
        'Deploy high-attention, emotionally distinctive creative',
        'Establish clear category membership cues'
      ]
    },
    {
      id: 'expand',
      name: 'EXPAND MEMORY',
      shortName: 'Expand',
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
      lightBg: 'bg-blue-50',
      hex: '#3b82f6',
      cognitiveProcess: 'Spreading activation; formation of multiple retrieval pathways; CEP linkage',
      questions: [
        'How many Category Entry Points (situations) trigger our brand?',
        'Are we linked to enough occasions to maximize retrieval opportunities?',
        'Do consumers associate us with diverse needs or just one narrow context?',
        'Are we building mental availability breadth or just depth?',
        'What new occasions or need-states could we own?'
      ],
      signals: [
        { key: 'associations', label: 'Brand Associations Count', benchmark: 8 },
        { key: 'occasions', label: 'Usage Occasions Linked', benchmark: 5 },
        { key: 'crossCategory', label: 'Cross-Category Purchase (%)', benchmark: 30 }
      ],
      diagnosticIndicators: [
        'Narrow associations (few attributes linked)',
        'Limited usage occasions (single context dependency)',
        'Low cross-category purchase (shallow relationship)'
      ],
      interventions: [
        'Develop campaigns targeting new Category Entry Points',
        'Create occasion-specific messaging variants',
        'Expand brand narrative beyond core positioning'
      ]
    },
    {
      id: 'strengthen',
      name: 'STRENGTHEN MEMORY',
      shortName: 'Strengthen',
      color: 'violet',
      bgColor: 'bg-violet-500',
      textColor: 'text-violet-600',
      borderColor: 'border-violet-500',
      lightBg: 'bg-violet-50',
      hex: '#8b5cf6',
      cognitiveProcess: 'Memory consolidation; trace reinforcement; affective encoding maintenance',
      questions: [
        'Are our existing memory structures decaying or staying strong?',
        'Is our media continuity sufficient to prevent forgetting?',
        'Do customers still feel positively about us (affective memory)?',
        'Are we maintaining loyalty or losing ground to habit erosion?',
        'How quickly do consumers forget us when we stop advertising?'
      ],
      signals: [
        { key: 'loyalty', label: 'Brand Loyalty (%)', benchmark: 55 },
        { key: 'repeatPurchase', label: 'Repeat Purchase Rate (%)', benchmark: 45 },
        { key: 'favourability', label: 'Favourability Score (%)', benchmark: 60 }
      ],
      diagnosticIndicators: [
        'Declining loyalty scores over time',
        'Fading prompted recall (memory trace weakening)',
        'Drop in repeat purchase frequency'
      ],
      interventions: [
        'Maintain continuous media presence (avoid dark periods)',
        'Deploy loyalty-focused messaging to existing customers',
        'Refresh creative while maintaining brand codes'
      ]
    },
    {
      id: 'retrieve',
      name: 'RETRIEVE MEMORY',
      shortName: 'Retrieve',
      color: 'amber',
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500',
      lightBg: 'bg-amber-50',
      hex: '#f59e0b',
      cognitiveProcess: 'Cue-dependent retrieval; retrieval fluency; mental availability activation',
      questions: [
        'Do consumers think of us when they have a need we can solve?',
        'Are we top-of-mind or buried in the consideration set?',
        'Why do people know us but not buy us? (awareness-action gap)',
        'Is our brand accessible at the moment of decision?',
        'Are the right retrieval cues present in the purchase environment?'
      ],
      signals: [
        { key: 'topOfMind', label: 'Top-of-Mind Awareness (%)', benchmark: 20 },
        { key: 'purchaseIntent', label: 'Purchase Intent (%)', benchmark: 40 },
        { key: 'posRecall', label: 'Spontaneous Recall at POS (%)', benchmark: 35 }
      ],
      diagnosticIndicators: [
        'Not recalled at purchase moment despite awareness',
        'Low purchase intent despite positive perceptions',
        'Encoding-retrieval context mismatch'
      ],
      interventions: [
        'Increase recency of exposure (continuous presence)',
        'Deploy point-of-sale and contextual triggers',
        'Strengthen distinctive brand assets as retrieval cues'
      ]
    },
    {
      id: 'reinstate',
      name: 'REINSTATE MEMORY',
      shortName: 'Reinstate',
      color: 'rose',
      bgColor: 'bg-rose-500',
      textColor: 'text-rose-600',
      borderColor: 'border-rose-500',
      lightBg: 'bg-rose-50',
      hex: '#f43f5e',
      cognitiveProcess: 'Memory reactivation; context reinstatement; retrieval pathway restoration',
      questions: [
        'Are we losing customers faster than we\'re acquiring them?',
        'Can we reactivate dormant memories among lapsed buyers?',
        'What triggers bring former customers back to the brand?',
        'How long before lapsed customers forget us entirely?',
        'Is our win-back messaging reconnecting with stored memories?'
      ],
      signals: [
        { key: 'lapseRate', label: 'Lapsed Usage Rate (%)', benchmark: 25, inverted: true },
        { key: 'timeSincePurchase', label: 'Avg Days Since Last Purchase', benchmark: 60, inverted: true },
        { key: 'reengagement', label: 'Re-engagement Response Rate (%)', benchmark: 15 }
      ],
      diagnosticIndicators: [
        'High lapse rate (customers leaving faster than acquired)',
        'Long time since last purchase (memory decay progressing)',
        'Low response to re-engagement efforts'
      ],
      interventions: [
        'Develop win-back campaigns with memory reinstatement cues',
        'Use personalized retargeting referencing past behavior',
        'Recreate original purchase context in messaging'
      ]
    },
    {
      id: 'defend',
      name: 'DEFEND MEMORY',
      shortName: 'Defend',
      color: 'slate',
      bgColor: 'bg-slate-500',
      textColor: 'text-slate-600',
      borderColor: 'border-slate-500',
      lightBg: 'bg-slate-50',
      hex: '#64748b',
      cognitiveProcess: 'Competitive interference defense; memory inhibition resistance; differentiation',
      questions: [
        'Are competitors overwriting our memory structures?',
        'Is our brand distinctive enough to resist substitution?',
        'Why are customers switching away from us?',
        'Are competitors stealing the associations we built?',
        'Do we own any attributes that competitors can\'t claim?'
      ],
      signals: [
        { key: 'switching', label: 'Switching Behavior (%)', benchmark: 20, inverted: true },
        { key: 'competitorStrength', label: 'Competitor Association (%)', benchmark: 30, inverted: true },
        { key: 'differentiation', label: 'Differentiation Score (%)', benchmark: 50 }
      ],
      diagnosticIndicators: [
        'High switching to competitors (memory displacement)',
        'Strong competitor associations on key attributes',
        'Weak differentiation (brand interchangeable)'
      ],
      interventions: [
        'Audit competitor messaging and ownership',
        'Strengthen distinctive positioning',
        'Increase SOV during competitive heavy-ups'
      ]
    }
  ];

  // Metric inputs state
  const [metrics, setMetrics] = useState({
    create: { awareness: 58, consideration: 32, recall: 22 },
    expand: { associations: 6, occasions: 4, crossCategory: 25 },
    strengthen: { loyalty: 48, repeatPurchase: 40, favourability: 55 },
    retrieve: { topOfMind: 15, purchaseIntent: 35, posRecall: 28 },
    reinstate: { lapseRate: 30, timeSincePurchase: 75, reengagement: 12 },
    defend: { switching: 28, competitorStrength: 38, differentiation: 42 }
  });

  // Competitor scores for radar comparison
  const [competitorScores, setCompetitorScores] = useState({
    create: 65,
    expand: 55,
    strengthen: 60,
    retrieve: 50,
    reinstate: 45,
    defend: 58
  });

  const [compareMode, setCompareMode] = useState('competitor');

  // Calculate individual stage score
  const calculateStageScore = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    const stageMetrics = metrics[stageId];

    let totalScore = 0;
    let signalCount = stage.signals.length;

    stage.signals.forEach(signal => {
      const value = stageMetrics[signal.key];
      const benchmark = signal.benchmark;

      let signalScore;
      if (signal.inverted) {
        signalScore = Math.min(100, Math.max(0, ((benchmark / Math.max(value, 1)) * 100)));
      } else {
        signalScore = Math.min(100, Math.max(0, (value / benchmark) * 100));
      }
      totalScore += signalScore;
    });

    return Math.round(totalScore / signalCount);
  };

  // Calculate all stage scores
  const stageScores = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage.id] = calculateStageScore(stage.id);
      return acc;
    }, {});
  }, [metrics]);

  // Calculate overall Memory Score (geometric mean)
  const overallScore = useMemo(() => {
    const scores = Object.values(stageScores);
    const product = scores.reduce((acc, score) => acc * Math.max(score, 1), 1);
    return Math.round(Math.pow(product, 1 / scores.length));
  }, [stageScores]);

  // Get status classification
  const getStatus = (score) => {
    if (score >= 80) return { label: 'DOMINANT', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-500' };
    if (score >= 60) return { label: 'ESTABLISHED', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-500' };
    if (score >= 40) return { label: 'VULNERABLE', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-500' };
    if (score >= 20) return { label: 'FRAGILE', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-500' };
    return { label: 'DORMANT', color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-500' };
  };

  const getStageStatus = (score) => {
    if (score >= 80) return { label: 'Optimal', color: 'text-emerald-600', bg: 'bg-emerald-100' };
    if (score >= 60) return { label: 'Healthy', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 40) return { label: 'At-Risk', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { label: 'Impaired', color: 'text-red-600', bg: 'bg-red-100' };
  };

  // Memory decay projection (5% weekly decline)
  const calculateDecay = () => {
    const weeks = [0, 4, 8, 12, 16];
    return weeks.map(w => ({
      week: w,
      label: w === 0 ? 'Now' : `W${w}`,
      score: Math.round(overallScore * Math.pow(0.95, w))
    }));
  };

  // Update metric handler
  const updateMetric = (stageId, signalKey, value) => {
    setMetrics(prev => ({
      ...prev,
      [stageId]: {
        ...prev[stageId],
        [signalKey]: parseFloat(value) || 0
      }
    }));
  };

  // PDF Export Function
  const exportToPDF = useCallback(async () => {
    if (!dashboardRef.current) return;

    setIsExporting(true);

    try {
      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#f9fafb',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Add header
      pdf.setFillColor(17, 24, 39);
      pdf.rect(0, 0, pdfWidth, 15, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Memory Score™ Diagnostic Report', 10, 10);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pdfWidth - 40, 10);

      // Calculate scaled dimensions to fit content
      const contentWidth = pdfWidth - 20;
      const contentHeight = (imgHeight * contentWidth) / imgWidth;

      // Check if content needs multiple pages
      const maxContentHeight = pdfHeight - 25;

      if (contentHeight <= maxContentHeight) {
        pdf.addImage(imgData, 'PNG', 10, 18, contentWidth, contentHeight);
      } else {
        let remainingHeight = contentHeight;
        let sourceY = 0;
        let pageNum = 1;

        while (remainingHeight > 0) {
          if (pageNum > 1) {
            pdf.addPage();
            pdf.setFillColor(17, 24, 39);
            pdf.rect(0, 0, pdfWidth, 15, 'F');
            pdf.setTextColor(255, 255, 255);
            pdf.setFontSize(10);
            pdf.text(`Memory Score™ - ${brandConfig.brandName} (Page ${pageNum})`, 10, 10);
          }

          const sliceHeight = Math.min(remainingHeight, maxContentHeight);
          const sourceHeight = (sliceHeight / contentHeight) * imgHeight;

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imgWidth;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');

          tempCtx.drawImage(
            canvas,
            0, sourceY, imgWidth, sourceHeight,
            0, 0, imgWidth, sourceHeight
          );

          const sliceData = tempCanvas.toDataURL('image/png');
          pdf.addImage(sliceData, 'PNG', 10, 18, contentWidth, sliceHeight);

          sourceY += sourceHeight;
          remainingHeight -= sliceHeight;
          pageNum++;
        }
      }

      // Add footer to last page
      pdf.setFillColor(249, 250, 251);
      pdf.rect(0, pdfHeight - 10, pdfWidth, 10, 'F');
      pdf.setTextColor(156, 163, 175);
      pdf.setFontSize(7);
      pdf.text('Media Experts | Omnicom Media Canada | Data Source: YouGov BrandIndex', 10, pdfHeight - 4);
      pdf.text('Confidential', pdfWidth - 25, pdfHeight - 4);

      const fileName = `MemoryScore_${brandConfig.brandName.replace(/\s+/g, '_')}_${brandConfig.reportPeriod.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [brandConfig, overallScore]);

  // Navigation tabs
  const NavTabs = () => (
    <div className="flex border-b border-gray-200 mb-6">
      {[
        { id: 'input', label: 'Data Input' },
        { id: 'framework', label: 'Framework' },
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'radar', label: 'Radar Comparison' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveView(tab.id)}
          className={`px-6 py-3 font-medium text-sm transition-colors ${
            activeView === tab.id
              ? 'border-b-2 border-emerald-500 text-emerald-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Live Score Preview component
  const LiveScorePreview = () => {
    const status = getStatus(overallScore);
    return (
      <div className={`p-4 rounded-lg border-2 ${status.border} ${status.bg} mb-6`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Live Memory Score™</p>
            <p className={`text-4xl font-bold ${status.color}`}>{overallScore}</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${status.bg} ${status.color} font-semibold`}>
            {status.label}
          </div>
        </div>
      </div>
    );
  };

  // PDF Export Button Component
  const ExportButton = () => (
    <button
      onClick={exportToPDF}
      disabled={isExporting}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isExporting
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-lg'
      }`}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Export PDF</span>
        </>
      )}
    </button>
  );

  // Data Input View
  const DataInputView = () => (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Brand Configuration</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Brand Name</label>
            <input
              type="text"
              value={brandConfig.brandName}
              onChange={(e) => setBrandConfig({ ...brandConfig, brandName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
            <input
              type="text"
              value={brandConfig.category}
              onChange={(e) => setBrandConfig({ ...brandConfig, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Report Period</label>
            <input
              type="text"
              value={brandConfig.reportPeriod}
              onChange={(e) => setBrandConfig({ ...brandConfig, reportPeriod: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Primary Competitor</label>
            <input
              type="text"
              value={brandConfig.competitor}
              onChange={(e) => setBrandConfig({ ...brandConfig, competitor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      <LiveScorePreview />

      <div className="grid grid-cols-2 gap-6">
        {stages.map((stage, index) => {
          const score = stageScores[stage.id];
          const status = getStageStatus(score);
          return (
            <div key={stage.id} className={`bg-white rounded-lg border-2 ${stage.borderColor} overflow-hidden`}>
              <div className={`${stage.bgColor} px-4 py-3 flex items-center justify-between`}>
                <h4 className="font-bold text-white">{stage.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-white text-2xl font-bold">{score}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
              <div className={`${stage.lightBg} px-4 py-3 border-b border-gray-200`}>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Key Questions</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {stage.questions.slice(0, 3).map((q, i) => (
                    <li key={i} className="flex items-start">
                      <span className={`mr-2 ${stage.textColor}`}>•</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 space-y-4">
                {stage.signals.map(signal => (
                  <div key={signal.key}>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-sm font-medium text-gray-700">{signal.label}</label>
                      <span className="text-xs text-gray-500">Benchmark: {signal.benchmark}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max={signal.key.includes('associations') || signal.key.includes('occasions') ? 15 : 100}
                        value={metrics[stage.id][signal.key]}
                        onChange={(e) => updateMetric(stage.id, signal.key, e.target.value)}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="number"
                        value={metrics[stage.id][signal.key]}
                        onChange={(e) => updateMetric(stage.id, signal.key, e.target.value)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md text-center"
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
  );

  // Framework View
  const FrameworkView = () => {
    const currentStage = stages[activeStage];
    const score = stageScores[currentStage.id];
    const status = getStageStatus(score);

    return (
      <div>
        <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Memory Score™ Core Premise</h2>
          <p className="text-gray-300 mb-3">
            Most purchasing decisions are <span className="text-emerald-400 font-semibold">memory retrieval tasks</span>,
            not rational evaluations. ~95% of decisions are System 1 (automatic, memory-driven).
          </p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-emerald-400 font-semibold">ENCODING</p>
              <p className="text-sm text-gray-300">How effectively brand is stored</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-400 font-semibold">RETRIEVAL</p>
              <p className="text-sm text-gray-300">How easily brand is accessed</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-amber-400 font-semibold">DEFENSE</p>
              <p className="text-sm text-gray-300">Where brand is failing</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {stages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(index)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeStage === index
                  ? `${stage.bgColor} text-white shadow-lg`
                  : `bg-gray-100 text-gray-600 hover:bg-gray-200`
              }`}
            >
              <span className="block text-xs opacity-75">Stage {index + 1}</span>
              <span className="block">{stage.shortName}</span>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <div className={`${currentStage.bgColor} px-6 py-4 flex items-center justify-between`}>
            <div>
              <h3 className="text-2xl font-bold text-white">{currentStage.name}</h3>
              <p className="text-white/80 text-sm mt-1">{currentStage.cognitiveProcess}</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{score}</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 p-6">
            <div>
              <h4 className={`font-bold ${currentStage.textColor} mb-3 text-lg`}>Questions We're Solving</h4>
              <ul className="space-y-2">
                {currentStage.questions.map((q, i) => (
                  <li key={i} className="flex items-start bg-gray-50 rounded-lg p-3">
                    <span className={`w-6 h-6 rounded-full ${currentStage.bgColor} text-white text-xs flex items-center justify-center mr-3 flex-shrink-0`}>
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className={`font-bold ${currentStage.textColor} mb-3`}>YouGov Signals</h4>
                <div className="space-y-2">
                  {currentStage.signals.map(signal => (
                    <div key={signal.key} className="flex justify-between items-center bg-gray-50 rounded-lg p-3">
                      <span className="text-gray-700">{signal.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">Benchmark: {signal.benchmark}</span>
                        <span className={`font-bold ${currentStage.textColor}`}>
                          {metrics[currentStage.id][signal.key]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-red-600 mb-3">Diagnostic Indicators (Warning Signs)</h4>
                <ul className="space-y-2">
                  {currentStage.diagnosticIndicators.map((indicator, i) => (
                    <li key={i} className="flex items-start text-gray-700 bg-red-50 rounded-lg p-3">
                      <span className="text-red-500 mr-2">⚠</span>
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-600 mb-3">Intervention Protocols</h4>
                <ul className="space-y-2">
                  {currentStage.interventions.map((intervention, i) => (
                    <li key={i} className="flex items-start text-gray-700 bg-emerald-50 rounded-lg p-3">
                      <span className="text-emerald-500 mr-2">→</span>
                      {intervention}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard View
  const DashboardView = () => {
    const status = getStatus(overallScore);
    const decayData = calculateDecay();
    const sortedStages = [...stages].sort((a, b) => stageScores[a.id] - stageScores[b.id]);

    return (
      <div>
        <div className="flex justify-end mb-4 print:hidden">
          <ExportButton />
        </div>

        <div ref={dashboardRef} className="space-y-6 bg-gray-50 p-1">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm mb-1">Memory Score™ Diagnostic Report</p>
                <h2 className="text-3xl font-bold">{brandConfig.brandName}</h2>
                <p className="text-gray-300 mt-1">{brandConfig.category} • {brandConfig.reportPeriod}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Overall Memory Score</p>
                <p className="text-5xl font-bold">{overallScore}</p>
                <span className={`inline-block mt-2 px-4 py-1 rounded-full font-semibold ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Memory Task Breakdown</h3>
              <div className="space-y-4">
                {stages.map(stage => {
                  const score = stageScores[stage.id];
                  const stStatus = getStageStatus(score);
                  return (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className="w-32">
                        <span className={`font-semibold ${stage.textColor}`}>{stage.shortName}</span>
                      </div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                        <div
                          className={`h-full ${stage.bgColor} transition-all duration-500`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <div className="w-12 text-right font-bold text-gray-800">{score}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${stStatus.bg} ${stStatus.color}`}>
                        {stStatus.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Memory Decay Projection</h3>
              <p className="text-sm text-gray-500 mb-4">~5% weekly decline without reinforcement</p>
              <div className="space-y-3">
                {decayData.map((point, i) => {
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-12 text-sm font-medium text-gray-600">{point.label}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            point.score >= 60 ? 'bg-emerald-500' :
                            point.score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${point.score}%` }}
                        />
                      </div>
                      <span className="w-10 text-sm font-bold text-gray-700">{point.score}</span>
                    </div>
                  );
                })}
              </div>
              {decayData[4].score < 40 && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-600 font-medium">
                    ⚠ Warning: Score projected to fall below VULNERABLE threshold by Week 16
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Priority Interventions</h3>
              <div className="space-y-4">
                {sortedStages.slice(0, 3).map((stage, i) => {
                  const score = stageScores[stage.id];
                  return (
                    <div key={stage.id} className={`p-4 rounded-lg ${stage.lightBg} border ${stage.borderColor}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-bold ${stage.textColor}`}>
                          #{i + 1} {stage.name}
                        </span>
                        <span className="font-bold text-gray-700">Score: {score}</span>
                      </div>
                      <ul className="space-y-1">
                        {stage.interventions.map((intervention, j) => (
                          <li key={j} className="text-sm text-gray-700 flex items-start">
                            <span className={`${stage.textColor} mr-2`}>→</span>
                            {intervention}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Key Diagnostic Questions</h3>
              <div className="space-y-4">
                {sortedStages.slice(0, 3).map(stage => {
                  const score = stageScores[stage.id];
                  return (
                    <div key={stage.id} className="border-l-4 pl-4" style={{ borderColor: stage.hex }}>
                      <p className={`font-semibold ${stage.textColor} mb-2`}>{stage.shortName} (Score: {score})</p>
                      <ul className="space-y-1">
                        {stage.questions.slice(0, 2).map((q, i) => (
                          <li key={i} className="text-sm text-gray-600">• {q}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Scientific Foundation</h3>
            <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
              <div><span className="font-semibold">Kahneman (2011):</span> Dual-Process Theory</div>
              <div><span className="font-semibold">Sharp & Romaniuk:</span> Mental Availability</div>
              <div><span className="font-semibold">Damasio (1994):</span> Somatic Marker Hypothesis</div>
              <div><span className="font-semibold">Ebbinghaus:</span> Forgetting Curve</div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Data Source: YouGov BrandIndex • Powered by Omni Platform (2.6B Global IDs)
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Radar Chart View
  const RadarChartView = () => {
    const brandScoresArray = stages.map(s => stageScores[s.id]);
    const compScoresArray = compareMode === 'competitor'
      ? stages.map(s => competitorScores[s.id])
      : stages.map(() => 60);

    const centerX = 200;
    const centerY = 200;
    const radius = 150;
    const angleStep = (2 * Math.PI) / 6;

    const getPoint = (index, value) => {
      const angle = (index * angleStep) - (Math.PI / 2);
      const r = (value / 100) * radius;
      return {
        x: centerX + r * Math.cos(angle),
        y: centerY + r * Math.sin(angle)
      };
    };

    const createPolygonPoints = (scores) => {
      return scores.map((score, i) => {
        const point = getPoint(i, score);
        return `${point.x},${point.y}`;
      }).join(' ');
    };

    const gridLevels = [20, 40, 60, 80, 100];

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Memory Structure Comparison</h3>
              <p className="text-gray-500 text-sm mt-1">
                {brandConfig.brandName} vs {compareMode === 'competitor' ? brandConfig.competitor : 'Category Benchmark'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCompareMode('competitor')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  compareMode === 'competitor'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                vs Competitor
              </button>
              <button
                onClick={() => setCompareMode('benchmark')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  compareMode === 'benchmark'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                vs Benchmark
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 flex justify-center">
              <svg width="400" height="400" viewBox="0 0 400 400">
                {gridLevels.map(level => (
                  <polygon
                    key={level}
                    points={[0, 1, 2, 3, 4, 5].map(i => {
                      const p = getPoint(i, level);
                      return `${p.x},${p.y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {stages.map((stage, i) => {
                  const endPoint = getPoint(i, 100);
                  return (
                    <line
                      key={stage.id}
                      x1={centerX}
                      y1={centerY}
                      x2={endPoint.x}
                      y2={endPoint.y}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  );
                })}

                <polygon
                  points={createPolygonPoints(compScoresArray)}
                  fill="rgba(244, 63, 94, 0.3)"
                  stroke="#f43f5e"
                  strokeWidth="2"
                />

                <polygon
                  points={createPolygonPoints(brandScoresArray)}
                  fill="rgba(5, 150, 105, 0.5)"
                  stroke="#059669"
                  strokeWidth="3"
                />

                {brandScoresArray.map((score, i) => {
                  const point = getPoint(i, score);
                  return (
                    <circle
                      key={`brand-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="#059669"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
                {compScoresArray.map((score, i) => {
                  const point = getPoint(i, score);
                  return (
                    <circle
                      key={`comp-${i}`}
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#f43f5e"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}

                {stages.map((stage, i) => {
                  const labelPoint = getPoint(i, 120);
                  return (
                    <text
                      key={stage.id}
                      x={labelPoint.x}
                      y={labelPoint.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={stage.hex}
                      fontWeight="bold"
                      fontSize="14"
                    >
                      {stage.shortName}
                    </text>
                  );
                })}

                {gridLevels.map(level => (
                  <text
                    key={level}
                    x={centerX + 5}
                    y={centerY - (level / 100) * radius}
                    fontSize="10"
                    fill="#9ca3af"
                  >
                    {level}
                  </text>
                ))}
              </svg>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-600" />
                  <span className="font-medium text-gray-700">{brandConfig.brandName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-rose-500" />
                  <span className="font-medium text-gray-700">
                    {compareMode === 'competitor' ? brandConfig.competitor : 'Benchmark'}
                  </span>
                </div>
              </div>

              {compareMode === 'competitor' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Competitor Scores</h4>
                  <div className="space-y-3">
                    {stages.map(stage => (
                      <div key={stage.id} className="flex items-center gap-3">
                        <span className={`w-24 text-sm font-medium ${stage.textColor}`}>
                          {stage.shortName}
                        </span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={competitorScores[stage.id]}
                          onChange={(e) => setCompetitorScores(prev => ({
                            ...prev,
                            [stage.id]: parseInt(e.target.value)
                          }))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={competitorScores[stage.id]}
                          onChange={(e) => setCompetitorScores(prev => ({
                            ...prev,
                            [stage.id]: parseInt(e.target.value) || 0
                          }))}
                          className="w-14 px-2 py-1 text-sm border border-gray-300 rounded text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold text-gray-600">Stage</th>
                      <th className="px-3 py-2 text-center font-semibold text-emerald-600">Brand</th>
                      <th className="px-3 py-2 text-center font-semibold text-rose-500">
                        {compareMode === 'competitor' ? 'Comp' : 'Bench'}
                      </th>
                      <th className="px-3 py-2 text-center font-semibold text-gray-600">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stages.map((stage, i) => {
                      const brandScore = brandScoresArray[i];
                      const compScore = compScoresArray[i];
                      const gap = brandScore - compScore;
                      return (
                        <tr key={stage.id} className="border-t border-gray-100">
                          <td className={`px-3 py-2 font-medium ${stage.textColor}`}>{stage.shortName}</td>
                          <td className="px-3 py-2 text-center font-bold">{brandScore}</td>
                          <td className="px-3 py-2 text-center">{compScore}</td>
                          <td className={`px-3 py-2 text-center font-bold ${
                            gap > 0 ? 'text-emerald-600' : gap < 0 ? 'text-red-600' : 'text-gray-500'
                          }`}>
                            {gap > 0 ? '+' : ''}{gap}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Gap Analysis</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-emerald-600 mb-3">Competitive Advantages</h4>
              <div className="space-y-2">
                {stages.filter(s => stageScores[s.id] > (compareMode === 'competitor' ? competitorScores[s.id] : 60)).map(stage => (
                  <div key={stage.id} className={`p-3 rounded-lg ${stage.lightBg} border ${stage.borderColor}`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${stage.textColor}`}>{stage.name}</span>
                      <span className="text-emerald-600 font-bold">
                        +{stageScores[stage.id] - (compareMode === 'competitor' ? competitorScores[stage.id] : 60)} pts
                      </span>
                    </div>
                  </div>
                ))}
                {stages.filter(s => stageScores[s.id] > (compareMode === 'competitor' ? competitorScores[s.id] : 60)).length === 0 && (
                  <p className="text-gray-500 italic">No competitive advantages identified</p>
                )}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-red-600 mb-3">Vulnerability Gaps</h4>
              <div className="space-y-2">
                {stages.filter(s => stageScores[s.id] < (compareMode === 'competitor' ? competitorScores[s.id] : 60)).map(stage => (
                  <div key={stage.id} className="p-3 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${stage.textColor}`}>{stage.name}</span>
                      <span className="text-red-600 font-bold">
                        {stageScores[stage.id] - (compareMode === 'competitor' ? competitorScores[stage.id] : 60)} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{stage.interventions[0]}</p>
                  </div>
                ))}
                {stages.filter(s => stageScores[s.id] < (compareMode === 'competitor' ? competitorScores[s.id] : 60)).length === 0 && (
                  <p className="text-gray-500 italic">No vulnerability gaps identified</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Score™</h1>
            <p className="text-gray-500 mt-1">Brand Memory Diagnostic Framework</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-400">Media Experts</p>
            <p className="text-xs text-gray-400">Omnicom Media Canada</p>
          </div>
        </div>

        <NavTabs />

        {activeView === 'input' && <DataInputView />}
        {activeView === 'framework' && <FrameworkView />}
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'radar' && <RadarChartView />}
      </div>
    </div>
  );
};

export default MemoryScoreDiagnostic;
