import { DividendTaxService } from './DividendTaxService';
import { BrbTracker } from '../models/BrbTracker';
import { TaxConstants } from '../constants/taxConstants';

describe('DividendTaxService', () => {
  it('calculates dividend tax for dividends only (allowance and basic rate)', () => {
    // Arrange
    const service = new DividendTaxService();
    const dividendIncome = 10000;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand); // All basic rate available

    // Act
    const result = service.calculateDividendTax(dividendIncome, brbTracker);

    // Assert
    // First £500 at 0% (dividend allowance)
    const allowanceBand = result.find(b => b.band === TaxConstants.AllowanceBand);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.DividendAllowance);
    expect(allowanceBand?.tax).toBe(0);

    // Next £9,500 at 8.75% (basic rate)
    const basicBand = result.find(b => b.band === TaxConstants.BasicBand);
    expect(basicBand).toBeDefined();
    expect(basicBand?.amount).toBe(9500);
    expect(basicBand?.rate).toBe(TaxConstants.DividendBasicRate);
    expect(basicBand?.tax).toBeCloseTo(831.25, 2);

    // No higher or additional rate bands should be present
    expect(result.find(b => b.band === TaxConstants.HigherBand)).toBeUndefined();
    expect(result.find(b => b.band === TaxConstants.AdditionalBand)).toBeUndefined();

    // Total tax should be £831.25
    const totalTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalTax).toBeCloseTo(831.25, 2);
  });

  it('calculates dividend tax for higher rate taxpayer (allowance, basic, higher)', () => {
    const service = new DividendTaxService();
    const dividendIncome = 50000; // Large enough for all bands
    const brbTracker = new BrbTracker(0); // No basic rate left

    // Act
    const result = service.calculateDividendTax(dividendIncome, brbTracker);

    // Assert
    // Allowance
    const allowanceBand = result.find(b => b.band === TaxConstants.AllowanceBand);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.DividendAllowance);
    expect(allowanceBand?.tax).toBe(0);

    // No basic band
    expect(result.find(b => b.band === TaxConstants.BasicBand)).toBeUndefined();

    // Higher band
    const higherBand = result.find(b => b.band === TaxConstants.HigherBand);
    expect(higherBand).toBeDefined();
    // All after allowance goes to higher band (since brbTracker is 0)
    expect(higherBand?.amount).toBe(49500);
    expect(higherBand?.rate).toBe(TaxConstants.DividendHigherRate);
    expect(higherBand?.tax).toBeCloseTo(49500 * TaxConstants.DividendHigherRate, 2);

    // No additional band
    expect(result.find(b => b.band === TaxConstants.AdditionalBand)).toBeUndefined();
  });

  it('calculates dividend tax for additional rate taxpayer (all bands)', () => {
    const service = new DividendTaxService();
    const dividendIncome = 200000; // Large enough for all bands
    const brbTracker = new BrbTracker(0); // No basic rate left

    // Act
    const result = service.calculateDividendTax(dividendIncome, brbTracker);

    // Assert
    // Allowance
    const allowanceBand = result.find(b => b.band === TaxConstants.AllowanceBand);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.DividendAllowance);
    expect(allowanceBand?.tax).toBe(0);

    // No basic band
    expect(result.find(b => b.band === TaxConstants.BasicBand)).toBeUndefined();

    // Higher band
    const higherBand = result.find(b => b.band === TaxConstants.HigherBand);
    expect(higherBand).toBeDefined();
    expect(higherBand?.amount).toBe(TaxConstants.HigherRateBand - TaxConstants.BasicRateBand);
    expect(higherBand?.rate).toBe(TaxConstants.DividendHigherRate);
    expect(higherBand?.tax).toBeCloseTo((TaxConstants.HigherRateBand - TaxConstants.BasicRateBand) * TaxConstants.DividendHigherRate, 2);

    // Additional band
    const additionalBand = result.find(b => b.band === TaxConstants.AdditionalBand);
    expect(additionalBand).toBeDefined();
    const expectedAdditional = 200000 - TaxConstants.DividendAllowance - (TaxConstants.HigherRateBand - TaxConstants.BasicRateBand);
    expect(additionalBand?.amount).toBe(expectedAdditional);
    expect(additionalBand?.rate).toBe(TaxConstants.DividendAdditionalRate);
    expect(additionalBand?.tax).toBeCloseTo(expectedAdditional * TaxConstants.DividendAdditionalRate, 2);
  });
});
