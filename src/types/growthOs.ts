export type OrderState = 
  | 'placed' 
  | 'confirmed' 
  | 'processing' 
  | 'ready_for_pickup' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'return_requested' 
  | 'returned';

export type PaymentAttemptState = 
  | 'created' 
  | 'pending' 
  | 'paid' 
  | 'failed' 
  | 'expired' 
  | 'cancelled';

export type RefundLifecycleState = 
  | 'not_requested' 
  | 'requested' 
  | 'pending' 
  | 'partially_refunded' 
  | 'refunded' 
  | 'failed';

export type FulfilmentConsignmentState = 
  | 'not_packed' 
  | 'packed' 
  | 'handed_to_carrier' 
  | 'in_transit' 
  | 'delivered' 
  | 'exception' 
  | 'lost';

export type CommissionLedgerState = 
  | 'pending' 
  | 'eligible' 
  | 'approved' 
  | 'paid' 
  | 'reversed' 
  | 'disputed';

export interface OrderItem {
  sku: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lotNumber?: string;
}

export interface AbangColekOrder {
  id: string;
  trackingToken: string; // High-entropy cryptographic token for public tracking without IDOR
  customerName: string;
  phone: string;
  city: string;
  fullAddress: string; // Redacted on public tracking
  items: OrderItem[];
  totalAmount: number;
  netSalesExTax: number;
  cogs: number;
  packagingCost: number;
  paymentFees: number;
  fulfilmentCost: number;
  deliverySubsidy: number;
  agentCommission: number;
  rewardCost: number;
  expectedReturnLoss: number;
  discountAmount: number;
  orderState: OrderState;
  paymentState: PaymentAttemptState;
  refundState: RefundLifecycleState;
  fulfilmentState: FulfilmentConsignmentState;
  commissionState: CommissionLedgerState;
  agentId?: string;
  referralCode?: string;
  consignmentId?: string;
  paymentTransactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionLedgerEntry {
  id: string;
  agentId: string;
  agentName: string;
  orderId?: string;
  type: 'commission_earned' | 'contra_adjustment' | 'bonus' | 'payout_withdrawal';
  amountRM: number; // Negative for contra adjustment or withdrawal
  status: CommissionLedgerState;
  reason: string;
  refPayoutId?: string;
  createdAt: string;
}

export interface ProductStockLot {
  lotNumber: string;
  sku: string;
  productName: string;
  category: 'kuah_colek' | 'buah_segar' | 'packaging';
  quantityUnits: number;
  allocatedUnits: number;
  processingDate: string;
  expiryDate: string; // For FEFO sorting
  storageLocation: string; // e.g. "Kuantan Hub Central Coldroom", "TBS Depot #3"
  status: 'active' | 'quarantined' | 'depleted' | 'expired';
  qcNotes: string;
  inspectedBy: string;
}

export interface BottleLeakComplaint {
  id: string;
  complaintDate: string;
  customerName: string;
  orderId: string;
  sku: string;
  lotNumber: string;
  capType: 'tamper_seal_twist' | 'flip_cap_spout' | 'induction_heat_seal';
  courierBus: 'Transnasional TBS' | 'Perdana Express' | 'J&T Express' | 'Kios Walk-in';
  description: string;
  proofImageUrl?: string;
  status: 'pending_triage' | 'replacement_approved' | 'lot_quarantine_triggered' | 'rejected';
  jevTriageAssessment?: {
    suggestedAction: string;
    riskLevel: 'Low' | 'Medium' | 'Critical';
    reasoning: string;
  };
}

export interface BusConsignment {
  consignmentNumber: string;
  receiptSlipNo: string;
  busLine: 'Transnasional' | 'Perdana Express' | 'Adik Beradik' | 'Sani Express';
  origin: string;
  destination: 'TBS Kuala Lumpur' | 'Kuantan Sentral' | 'Kemaman Terminal' | 'Dungun Hub' | 'Kota Bharu Terminal';
  dispatchTime: string;
  estimatedArrival: string;
  packageCount: number;
  cargoDescription: string;
  status: 'staged' | 'handed_over' | 'in_transit' | 'arrived' | 'collected';
  branchReceiverName?: string;
  receiverPhone?: string;
}

export interface KioskDayClose {
  id: string;
  kioskName: string;
  date: string;
  openingFloatRM: number;
  systemCashSalesRM: number;
  systemCardFpxSalesRM: number;
  pettyExpensesRM: number;
  physicalCashCountRM: number;
  varianceRM: number; // physicalCashCountRM - (openingFloatRM + systemCashSalesRM - pettyExpensesRM)
  status: 'balanced' | 'flagged_variance' | 'approved';
  supervisorName: string;
  supervisorNotes: string;
}

export interface CampaignMarginRule {
  id: string;
  campaignName: string;
  voucherCode: string;
  discountPct: number;
  minSpendRM: number;
  minContributionRM: number;
  minContributionMarginPct: number;
  estimatedCogs: number;
  estimatedPackaging: number;
  estimatedPaymentFee: number;
  estimatedFulfilment: number;
  estimatedDeliverySubsidy: number;
  estimatedAgentCommission: number;
  estimatedRewardCost: number;
  estimatedReturnLoss: number;
  status: 'active' | 'blocked_by_margin_guardian' | 'founder_override_active';
  founderOverrideReason?: string;
  founderOverrideBy?: string;
}

export interface AcceptanceTestResult {
  id: 'FIN-01' | 'PAY-01' | 'PAY-02' | 'PAY-03' | 'STK-01' | 'OFF-01' | 'REF-01' | 'REF-02' | 'SEC-01' | 'SEC-02' | 'DR-01' | 'AI-01' | 'PD-01' | 'OPS-01';
  name: string;
  category: 'Financial' | 'Payment' | 'Stock' | 'Offline' | 'Referral' | 'Security' | 'Disaster' | 'AI / Resilience' | 'Operations';
  description: string;
  passed: boolean;
  details: string;
  executionTimeMs: number;
  executionLog: string[];
}
