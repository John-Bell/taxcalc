export interface IncomeBreakdown {
  generalIncome: number;
  rentalIncome: number;
  savingsIncome: number;
  dividendIncome: number;
}

export interface TaxCalculationResult {
  personalAllowance: number;
  brbExtended: number;
  incomeBreakdown: IncomeBreakdown;
  taxByBand: import('./TaxBandResult').TaxBandResult[];
  totalTax: number;
  effectiveTaxRate: number;
  // Optionally, add taxableIncome if needed
  taxableIncome?: number;
}
