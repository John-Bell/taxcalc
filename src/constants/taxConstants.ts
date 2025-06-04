export const TaxConstants = {
  // Personal Allowance
  StandardPersonalAllowance: 12570,
  PersonalAllowanceThreshold: 100000,
  PersonalAllowanceRemovalThreshold: 125140,
  PersonalAllowanceReductionRate: 0.5, // £1 reduction per £2 over threshold

  // Basic Rate Band
  BasicRateBand: 37700,
  BasicRate: 0.20,

  // Higher Rate Band
  HigherRateBand: 125140,
  HigherRate: 0.40,

  // Additional Rate
  AdditionalRate: 0.45,

  // Dividend Rates
  DividendAllowance: 500, // Updated for 2025/2026 tax year
  DividendBasicRate: 0.0875,
  DividendHigherRate: 0.3375,
  DividendAdditionalRate: 0.3935,

  // Savings Allowance
  SavingsAllowanceBasic: 1000,
  SavingsAllowanceHigher: 500,
  SavingsAllowanceAdditional: 0,

  // Starting Rate for Savings
  StartingRateForSavingsThreshold: 5000, // £5,000 starting rate for savings
  StartingRateForSavings: 0,

  // Tax Band Types
  GeneralBandType: "General",
  SavingsBandType: "Savings",
  DividendsBandType: "Dividends",

  // Tax Band Names
  AllowanceBand: "Allowance",
  BasicBand: "Basic",
  HigherBand: "Higher",
  AdditionalBand: "Additional",
  StartingBand: "Starting",
};
