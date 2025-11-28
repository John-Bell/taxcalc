import { getTaxConstants } from '../constants/taxConstants';
import { BrbTracker } from '../models/BrbTracker';
import type { TaxBandResult } from '../models/TaxBandResult';

export class RentalTaxService {
  constructor(private readonly taxYear?: string) {}

  calculateRentalTax(
    rentalIncome: number,
    _grossNonSavingsIncome: number,
    _personalAllowance: number,
    brbTracker: BrbTracker,
    _generalTaxBands: TaxBandResult[] = [],
    taxYear?: string
  ): TaxBandResult[] {
    const taxConstants = getTaxConstants(taxYear ?? this.taxYear);
    const taxBands: TaxBandResult[] = [];
    if (rentalIncome <= 0) return taxBands;

    let remainingRental = rentalIncome;

    if (remainingRental > 0 && brbTracker.remaining > 0) {
      const basicRateAmount = brbTracker.use(remainingRental);
      taxBands.push({
        band: taxConstants.BasicBand,
        type: taxConstants.RentalBandType,
        amount: basicRateAmount,
        rate: taxConstants.RentalBasicRate,
        tax: basicRateAmount * taxConstants.RentalBasicRate,
      });
      remainingRental -= basicRateAmount;
    }

    if (remainingRental > 0) {
      const higherRateAmount = Math.min(
        remainingRental,
        taxConstants.HigherRateBand - taxConstants.BasicRateBand
      );
      taxBands.push({
        band: taxConstants.HigherBand,
        type: taxConstants.RentalBandType,
        amount: higherRateAmount,
        rate: taxConstants.RentalHigherRate,
        tax: higherRateAmount * taxConstants.RentalHigherRate,
      });
      remainingRental -= higherRateAmount;
    }

    if (remainingRental > 0) {
      taxBands.push({
        band: taxConstants.AdditionalBand,
        type: taxConstants.RentalBandType,
        amount: remainingRental,
        rate: taxConstants.RentalAdditionalRate,
        tax: remainingRental * taxConstants.RentalAdditionalRate,
      });
    }

    return taxBands;
  }
}
