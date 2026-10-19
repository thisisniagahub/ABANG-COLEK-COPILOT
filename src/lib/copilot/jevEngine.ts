/**
 * Jev System-1 Decision Engine (TypeSafe AI / CopilotKit Cookbook Architecture)
 * Rapid, structured decision layer for Generative UI component orchestration.
 * Unlike standard text-generating LLMs, Jev accepts application state + prompt,
 * and deterministically selects, scores, and ranks pre-configured UI components.
 */

export type JevComponentType = 
  | 'margin_guardian' 
  | 'qc_bottle_triage' 
  | 'bus_consignment' 
  | 'kiosk_reconciliation' 
  | 'acceptance_tests' 
  | 'commission_audit'
  | 'none';

export interface JevDecision {
  selectedComponentId: JevComponentType;
  confidence: number; // 0.0 - 1.0
  riskLevel: 'Low' | 'Medium' | 'Critical';
  requiresHitl: boolean; // Human In The Loop required?
  hitlActionName?: string;
  decisionLatencyMs: number;
  decisionReason: string;
  probabilities: Array<{
    componentId: JevComponentType;
    label: string;
    probability: number;
  }>;
  payload: Record<string, any>;
}

export class JevDecisionEngine {
  /**
   * Fast System-1 Decision Evaluation (<20ms)
   * Evaluates input prompt against active application state
   */
  public static evaluate(
    prompt: string, 
    activeState?: { currentTab?: string; activeItem?: any }
  ): JevDecision {
    const start = performance.now();
    const text = prompt.toLowerCase();

    // 1. Probabilistic scoring matrix based on domain intent
    let marginScore = 0.05;
    let qcScore = 0.05;
    let busScore = 0.05;
    let kioskScore = 0.05;
    let testsScore = 0.05;
    let commissionScore = 0.05;

    // Margin Guardian intent signals
    if (text.includes('margin') || text.includes('padu15') || text.includes('voucher') || text.includes('diskaun') || text.includes('baucar')) {
      marginScore += 0.90;
    }

    // QC Leak Triage intent signals
    if (text.includes('bocor') || text.includes('leak') || text.includes('qc') || text.includes('081') || text.includes('penutup') || text.includes('tamper')) {
      qcScore += 0.92;
    }

    // Bus Consignment intent signals
    if (text.includes('bas') || text.includes('konsainan') || text.includes('tbs') || text.includes('kuantan') || text.includes('transnasional') || text.includes('perdana')) {
      busScore += 0.88;
    }

    // Kiosk Day-Close Reconciliation intent signals
    if (text.includes('kios') || text.includes('day close') || text.includes('rekonsiliasi') || text.includes('apungan') || text.includes('laci') || text.includes('tunai')) {
      kioskScore += 0.89;
    }

    // Acceptance Test Suite intent signals
    if (text.includes('acceptance') || text.includes('test') || text.includes('ujian') || text.includes('fin-01') || text.includes('blueprint') || text.includes('suite')) {
      testsScore += 0.94;
    }

    // Commission & Contra intent signals
    if (text.includes('komisen') || text.includes('contra') || text.includes('ejen') || text.includes('stokis') || text.includes('payout')) {
      commissionScore += 0.87;
    }

    // Boost score if user is currently on that tab (Shared State awareness)
    if (activeState?.currentTab === 'margin') marginScore += 0.15;
    if (activeState?.currentTab === 'operations') { qcScore += 0.12; busScore += 0.12; kioskScore += 0.12; }
    if (activeState?.currentTab === 'tests') testsScore += 0.20;
    if (activeState?.currentTab === 'dealers') commissionScore += 0.20;

    // Normalization
    const rawScores: Array<{ id: JevComponentType; label: string; score: number }> = [
      { id: 'margin_guardian', label: 'Margin Guardian Card', score: marginScore },
      { id: 'qc_bottle_triage', label: 'QC Bottle Triage Card', score: qcScore },
      { id: 'bus_consignment', label: 'Bus Consignment Timeline', score: busScore },
      { id: 'kiosk_reconciliation', label: 'Kiosk Day-Close Meter', score: kioskScore },
      { id: 'acceptance_tests', label: 'Acceptance Test Matrix', score: testsScore },
      { id: 'commission_audit', label: 'Commission Contra Ledger', score: commissionScore }
    ];

    const totalRaw = rawScores.reduce((sum, item) => sum + item.score, 0);
    const probabilities = rawScores.map(item => ({
      componentId: item.id,
      label: item.label,
      probability: Number((item.score / totalRaw).toFixed(3))
    })).sort((a, b) => b.probability - a.probability);

    const highest = probabilities[0];
    const isSignificant = highest.probability > 0.35;

    let selectedComponentId: JevComponentType = isSignificant ? highest.componentId : 'none';
    let riskLevel: 'Low' | 'Medium' | 'Critical' = 'Low';
    let requiresHitl = false;
    let hitlActionName = undefined;
    let decisionReason = '';
    let payload: Record<string, any> = {};

    switch (selectedComponentId) {
      case 'margin_guardian':
        riskLevel = 'Medium';
        requiresHitl = text.includes('50%') || text.includes('override') || text.includes('batal');
        hitlActionName = requiresHitl ? 'Founder Override Approval' : undefined;
        decisionReason = 'Jev mengesan niat penilaian kelulusan kempen diskaun. Memilih MarginGuardianWidget.';
        payload = {
          voucherCode: 'PADU15',
          sampleSpendRM: 35.00,
          discountPct: 15,
          minContributionRM: 4.00,
          minMarginPct: 20.0
        };
        break;

      case 'qc_bottle_triage':
        riskLevel = text.includes('pecah') ? 'Critical' : 'Medium';
        requiresHitl = true;
        hitlActionName = 'Approve Free Replacement Bottle';
        decisionReason = 'Jev mengesan aduan kerosakan botol/lelehan kuah. Memilih QcTriageWidget dengan barisan kelulusan penyelia.';
        payload = {
          complaintId: 'QC-LEAK-2026-081',
          sku: 'SKU-COLEK-ORI-500',
          lotNumber: 'AC-LOT-202610-K01',
          capType: 'tamper_seal_twist',
          courier: 'Transnasional TBS'
        };
        break;

      case 'bus_consignment':
        riskLevel = 'Low';
        requiresHitl = false;
        decisionReason = 'Jev mengesan pertanyaan logistik bas ekspres Pantai Timur. Memilih BusConsignmentTimeline.';
        payload = {
          route: 'Kuantan Sentral -> TBS Kuala Lumpur',
          busLine: 'Transnasional',
          consignmentNo: 'BUS-EC-20261018-01'
        };
        break;

      case 'kiosk_reconciliation':
        riskLevel = 'Low';
        requiresHitl = false;
        decisionReason = 'Jev mengesan penutupan buku tunai laci kios. Memilih KioskCashReconciliation.';
        payload = {
          kioskName: 'Kios AbangColek TBS Aras 2',
          openingFloat: 200,
          systemSales: 1450,
          pettyExpenses: 45,
          physicalCash: 1605
        };
        break;

      case 'acceptance_tests':
        riskLevel = 'Low';
        requiresHitl = false;
        decisionReason = 'Jev mengesan permintaan audit pematuhan Blueprint v2.1. Memilih AcceptanceTestMatrix.';
        payload = { testFilter: 'ALL' };
        break;

      case 'commission_audit':
        riskLevel = 'Medium';
        requiresHitl = false;
        decisionReason = 'Jev mengesan semakan lejar komisen append-only & pelarasan kontra PAY-03.';
        payload = { agentId: 'AGT-001' };
        break;

      default:
        decisionReason = 'Jev mengkategorikan sebagai pertanyaan operasi umum tanpa komponen khas.';
    }

    const decisionLatencyMs = Number((performance.now() - start).toFixed(2));

    return {
      selectedComponentId,
      confidence: highest.probability,
      riskLevel,
      requiresHitl,
      hitlActionName,
      decisionLatencyMs,
      decisionReason,
      probabilities,
      payload
    };
  }
}
