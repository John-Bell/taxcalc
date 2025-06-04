import { SavingsTaxService } from './SavingsTaxService';
import { GeneralTaxService } from './GeneralTaxService';
import { BrbTracker } from '../models/BrbTracker';
import { TaxConstants } from '../constants/taxConstants';

describe('GeneralTaxService (Savings Tax Scenarios)', () => {
  it('calculates savings tax for basic rate taxpayer (all covered by allowance)', () => {
    // Arrange
    const service = new SavingsTaxService();
    const savingsIncome = 1000; // All covered by allowance
    const grossNonSavingsIncome = 35000; // Salary + rental
    const personalAllowance = TaxConstants.StandardPersonalAllowance; // 12570
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand); // 37700

    // Act
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker,
      [] // No general bands, so maxRate = 0, so allowance = SavingsAllowanceBasic
    );

    // Assert
    // Should have savings allowance of £1,000 at 0%
    const allowanceBand = result.find(b => b.band === TaxConstants.BasicBand && b.rate === 0);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.SavingsAllowanceBasic);
    expect(allowanceBand?.tax).toBe(0);

    // No other bands should be present
    expect(result.length).toBe(1);
    // Total savings tax should be 0
    const totalSavingsTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalSavingsTax).toBe(0);
  });

  it('calculates savings tax for higher rate taxpayer (partial allowance, rest taxed at 40%)', () => {
    // Arrange
    const service = new SavingsTaxService();
    const savingsIncome = 2000; // £500 allowance, £1500 taxed at 40%
    const grossNonSavingsIncome = 60000; // Higher rate
    const personalAllowance = TaxConstants.StandardPersonalAllowance; // 12570
    const brbTracker = new BrbTracker(0); // No basic rate band left
    // Simulate general bands with maxRate = HigherRate
    const generalBands = [{
      band: TaxConstants.HigherBand,
      type: TaxConstants.GeneralBandType,
      amount: 0,
      rate: TaxConstants.HigherRate,
      tax: 0
    }];

    // Act
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker,
      generalBands
    );

    // Assert
    // Should have savings allowance of £500 at 0% (in higher band)
    const allowanceBand = result.find(b => b.band === TaxConstants.HigherBand && b.rate === 0);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.SavingsAllowanceHigher);
    expect(allowanceBand?.tax).toBe(0);

    // Remaining £1500 should be taxed at higher rate
    const higherRateBand = result.find(b => b.band === TaxConstants.HigherBand && b.rate === TaxConstants.HigherRate);
    expect(higherRateBand).toBeDefined();
    expect(higherRateBand?.amount).toBe(1500);
    expect(higherRateBand?.tax).toBeCloseTo(600);

    // Total savings tax should be £600
    const totalSavingsTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalSavingsTax).toBeCloseTo(600);
  });

  it('returns no bands and zero tax when there is no savings income', () => {
    const service = new SavingsTaxService();
    const savingsIncome = 0;
    const grossNonSavingsIncome = 20000;
    const personalAllowance = TaxConstants.StandardPersonalAllowance;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand);
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker
    );
    expect(result.length).toBe(0);
    const totalSavingsTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalSavingsTax).toBe(0);
  });

  it('calculates savings tax using all bands (basic, higher, additional)', () => {
    const service = new SavingsTaxService();
    const savingsIncome = 200000; // Large savings income
    const grossNonSavingsIncome = 0; // All bands available
    const personalAllowance = TaxConstants.StandardPersonalAllowance;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand); // 37700
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker
    );
    // Should have allowance, starting, basic, higher, and additional bands
    expect(result.some(b => b.band === TaxConstants.BasicBand)).toBe(true);
    expect(result.some(b => b.band === TaxConstants.HigherBand)).toBe(true);
    expect(result.some(b => b.band === TaxConstants.AdditionalBand)).toBe(true);
    // Additional band amount should be positive
    const additionalBand = result.find(b => b.band === TaxConstants.AdditionalBand);
    expect(additionalBand).toBeDefined();
    expect(additionalBand!.amount).toBeGreaterThan(0);
  });

  it('does not apply starting rate for savings if no personal allowance', () => {
    const service = new SavingsTaxService();
    const savingsIncome = 6000;
    const grossNonSavingsIncome = 130000; // High income
    const personalAllowance = 0; // No personal allowance
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand);
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker
    );
    // Should not have starting rate band
    expect(result.some(b => b.band === TaxConstants.StartingBand)).toBe(false);
  });
});

describe('GeneralTaxService', () => {
  it('calculates basic rate tax correctly', () => {
    const service = new GeneralTaxService();
    const income = 50000;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand);
    const taxBands = service.calculateGeneralIncomeTax(income, brbTracker);
    const basicRateBand = taxBands.find(b => b.band === TaxConstants.BasicBand && b.type === TaxConstants.GeneralBandType);
    expect(basicRateBand).toBeDefined();
    expect(basicRateBand?.amount).toBe(TaxConstants.BasicRateBand);
    expect(basicRateBand?.tax).toBeCloseTo(TaxConstants.BasicRateBand * TaxConstants.BasicRate);
  });

  it('calculates higher rate tax correctly', () => {
    const service = new GeneralTaxService();
    const income = 100000;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand);
    const taxBands = service.calculateGeneralIncomeTax(income, brbTracker);
    const higherRateBand = taxBands.find(b => b.band === TaxConstants.HigherBand && b.type === TaxConstants.GeneralBandType);
    expect(higherRateBand).toBeDefined();
    expect(higherRateBand?.amount).toBe(100000 - TaxConstants.BasicRateBand);
    expect(higherRateBand?.tax).toBeCloseTo((100000 - TaxConstants.BasicRateBand) * TaxConstants.HigherRate);
  });

  it('calculates additional rate tax correctly', () => {
    const service = new GeneralTaxService();
    const income = 200000;
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand);
    const taxBands = service.calculateGeneralIncomeTax(income, brbTracker);
    const additionalRateBand = taxBands.find(b => b.band === TaxConstants.AdditionalBand && b.type === TaxConstants.GeneralBandType);
    expect(additionalRateBand).toBeDefined();
    expect(additionalRateBand?.amount).toBe(200000 - TaxConstants.HigherRateBand);
    expect(additionalRateBand?.tax).toBeCloseTo((200000 - TaxConstants.HigherRateBand) * TaxConstants.AdditionalRate);
  });
});
