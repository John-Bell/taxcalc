import { TaxConstants } from '../constants/taxConstants';
import { BrbTracker } from '../models/BrbTracker';
import type { TaxBandResult } from '../models/TaxBandResult';

export class SavingsTaxService {
  calculateSavingsTax(
    savingsIncome: number,
    grossNonSavingsIncome: number,
    personalAllowance: number,
    brbTracker: BrbTracker,
    generalTaxBands: TaxBandResult[] = []
  ): TaxBandResult[] {
    const taxBands: TaxBandResult[] = [];
    if (savingsIncome <= 0) return taxBands;

    let remainingSavings = savingsIncome;
    let maxRateApplied = generalTaxBands && generalTaxBands.length > 0 ? Math.max(...generalTaxBands.map(b => b.rate)) : 0;

    // STARTING RATE
    if (grossNonSavingsIncome < personalAllowance) {
      const startingRateLimit = 5000;
      const maxStarting = Math.min(startingRateLimit, personalAllowance - grossNonSavingsIncome);
      const startingApplied = Math.min(remainingSavings, maxStarting);
      if (startingApplied > 0) {
        taxBands.push({
          band: TaxConstants.StartingBand,
          type: TaxConstants.SavingsBandType,
          amount: startingApplied,
          rate: TaxConstants.StartingRateForSavings,
          tax: 0,
        });
        remainingSavings -= startingApplied;
      }
    }

    // Collect all bands before applying savings allowance
    const pendingBands: TaxBandResult[] = [];
    function addBand(bandName: string, income: number, rate: number) {
      if (income <= 0) return;
      maxRateApplied = Math.max(maxRateApplied, rate);
      pendingBands.push({
        band: bandName,
        type: TaxConstants.SavingsBandType,
        amount: income,
        rate: rate,
        tax: income * rate,
      });
    }

    // BASIC RATE BAND
    const basicRateUsed = brbTracker.use(remainingSavings);
    addBand(TaxConstants.BasicBand, basicRateUsed, TaxConstants.BasicRate);
    remainingSavings -= basicRateUsed;

    // HIGHER RATE BAND
    const higherRateLimit = TaxConstants.HigherRateBand - TaxConstants.BasicRateBand;
    const higherRateUsed = Math.min(remainingSavings, higherRateLimit);
    addBand(TaxConstants.HigherBand, higherRateUsed, TaxConstants.HigherRate);
    remainingSavings -= higherRateUsed;

    // ADDITIONAL RATE BAND
    addBand(TaxConstants.AdditionalBand, remainingSavings, TaxConstants.AdditionalRate);

    // Now apply savings allowance based on max rate seen
    let savingsAllowance =
      maxRateApplied >= TaxConstants.AdditionalRate
        ? 0
        : maxRateApplied >= TaxConstants.HigherRate
        ? TaxConstants.SavingsAllowanceHigher
        : TaxConstants.SavingsAllowanceBasic;

    for (const band of pendingBands) {
      const originalAmount = band.amount;
      const allowanceApplied = Math.min(originalAmount, savingsAllowance);
      if (allowanceApplied > 0) {
        taxBands.push({
          band: band.band,
          type: band.type,
          amount: allowanceApplied,
          rate: 0,
          tax: 0,
        });
      }
      const taxableAmount = originalAmount - allowanceApplied;
      if (taxableAmount > 0) {
        taxBands.push({
          band: band.band,
          type: band.type,
          amount: taxableAmount,
          rate: band.rate,
          tax: taxableAmount * band.rate,
        });
      }
      savingsAllowance -= allowanceApplied;
    }

    return taxBands;
  }
}
