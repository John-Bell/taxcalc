import { TaxConstants } from '../constants/taxConstants';
import { BrbTracker } from '../models/BrbTracker';
import type { TaxBandResult } from '../models/TaxBandResult';

export class DividendTaxService {
  calculateDividendTax(dividendIncome: number, brbTracker: BrbTracker): TaxBandResult[] {
    const taxBands: TaxBandResult[] = [];
    if (dividendIncome <= 0) return taxBands;

    // Apply dividend allowance
    let remainingDividends = dividendIncome;
    if (remainingDividends > 0 && TaxConstants.DividendAllowance > 0) {
      const allowanceAmount = Math.min(remainingDividends, TaxConstants.DividendAllowance);
      taxBands.push({
        band: TaxConstants.AllowanceBand,
        type: TaxConstants.DividendsBandType,
        amount: allowanceAmount,
        rate: 0,
        tax: 0,
      });
      remainingDividends -= allowanceAmount;
    }

    // Apply dividend rates to remaining amount
    if (remainingDividends > 0) {
      // Basic rate
      if (remainingDividends > 0 && brbTracker.remaining > 0) {
        const basicRateAmount = brbTracker.use(remainingDividends);
        taxBands.push({
          band: TaxConstants.BasicBand,
          type: TaxConstants.DividendsBandType,
          amount: basicRateAmount,
          rate: TaxConstants.DividendBasicRate,
          tax: basicRateAmount * TaxConstants.DividendBasicRate,
        });
        remainingDividends -= basicRateAmount;
      }

      // Higher rate
      if (remainingDividends > 0) {
        const higherRateAmount = Math.min(
          remainingDividends,
          TaxConstants.HigherRateBand - TaxConstants.BasicRateBand
        );
        taxBands.push({
          band: TaxConstants.HigherBand,
          type: TaxConstants.DividendsBandType,
          amount: higherRateAmount,
          rate: TaxConstants.DividendHigherRate,
          tax: higherRateAmount * TaxConstants.DividendHigherRate,
        });
        remainingDividends -= higherRateAmount;
      }

      // Additional rate
      if (remainingDividends > 0) {
        taxBands.push({
          band: TaxConstants.AdditionalBand,
          type: TaxConstants.DividendsBandType,
          amount: remainingDividends,
          rate: TaxConstants.DividendAdditionalRate,
          tax: remainingDividends * TaxConstants.DividendAdditionalRate,
        });
      }
    }
    return taxBands;
  }
}
