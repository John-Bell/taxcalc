import { TaxConstants } from '../constants/taxConstants';
import { BrbTracker } from '../models/BrbTracker';
import type { TaxBandResult } from '../models/TaxBandResult';

export class GeneralTaxService {
  calculateGeneralIncomeTax(income: number, brbTracker: BrbTracker): TaxBandResult[] {
    const taxBands: TaxBandResult[] = [];
    let remainingIncome = income;

    // Basic rate
    if (remainingIncome > 0 && brbTracker.remaining > 0) {
      const basicRateAmount = brbTracker.use(remainingIncome);
      taxBands.push({
        band: TaxConstants.BasicBand,
        type: TaxConstants.GeneralBandType,
        amount: basicRateAmount,
        rate: TaxConstants.BasicRate,
        tax: basicRateAmount * TaxConstants.BasicRate,
      });
      remainingIncome -= basicRateAmount;
    }

    // Higher rate
    if (remainingIncome > 0) {
      const higherRateAmount = Math.min(
        remainingIncome,
        TaxConstants.HigherRateBand - TaxConstants.BasicRateBand
      );
      taxBands.push({
        band: TaxConstants.HigherBand,
        type: TaxConstants.GeneralBandType,
        amount: higherRateAmount,
        rate: TaxConstants.HigherRate,
        tax: higherRateAmount * TaxConstants.HigherRate,
      });
      remainingIncome -= higherRateAmount;
    }

    // Additional rate
    if (remainingIncome > 0) {
      taxBands.push({
        band: TaxConstants.AdditionalBand,
        type: TaxConstants.GeneralBandType,
        amount: remainingIncome,
        rate: TaxConstants.AdditionalRate,
        tax: remainingIncome * TaxConstants.AdditionalRate,
      });
    }

    return taxBands;
  }
}
