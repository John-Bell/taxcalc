import { SavingsTaxService } from './SavingsTaxService';
import { BrbTracker } from '../models/BrbTracker';
import { TaxConstants } from '../constants/taxConstants';

describe('SavingsTaxService', () => {
  it('calculates starting rate for savings correctly', () => {
    // Arrange
    const service = new SavingsTaxService();
    const savingsIncome = 10000;
    const grossNonSavingsIncome = 2000; // rental income
    const personalAllowance = TaxConstants.StandardPersonalAllowance; // 12570
    const brbTracker = new BrbTracker(TaxConstants.BasicRateBand); // 37700

    // Act
    const result = service.calculateSavingsTax(
      savingsIncome,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker
    );

    // Assert
    // Should have starting rate band of £5,000 at 0%
    const startingRateBand = result.find(b => b.band === TaxConstants.StartingBand);
    expect(startingRateBand).toBeDefined();
    expect(startingRateBand?.amount).toBe(TaxConstants.StartingRateForSavingsThreshold);
    expect(startingRateBand?.rate).toBe(TaxConstants.StartingRateForSavings);
    expect(startingRateBand?.tax).toBe(0);

    const allowanceBand = result.find(b => b.band === TaxConstants.BasicBand && b.rate === 0);
    expect(allowanceBand).toBeDefined();
    expect(allowanceBand?.amount).toBe(TaxConstants.SavingsAllowanceBasic);
    expect(allowanceBand?.tax).toBe(0);

    // Remaining £4,000 should be taxed at basic rate
    const basicRateBand = result.find(b => b.band === TaxConstants.BasicBand && b.rate === TaxConstants.BasicRate);
    expect(basicRateBand).toBeDefined();
    expect(basicRateBand?.amount).toBe(4000);
    expect(basicRateBand?.tax).toBeCloseTo(800);

    // Verify total savings tax
    const totalSavingsTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalSavingsTax).toBeCloseTo(800);
  });

  it('should apply £500 savings allowance when savings push into higher rate', () => {
    // Arrange: scenario based on C# Should_Apply_500_SavingsAllowance_When_Savings_Push_Into_Higher_Rate
    const service = new SavingsTaxService();
    const salary = 100800;
    const rentalIncome = 0;
    const pensionIncome = 0;
    const untaxedInterest = 10000; // savings
    const directPensionContrib = 60000;
    const personalAllowance = TaxConstants.StandardPersonalAllowance; // 12570
    const brbExtended = TaxConstants.BasicRateBand + directPensionContrib; // 37700 + 60000 = 97700
    const grossNonSavingsIncome = salary + rentalIncome + pensionIncome; // 100800
    const brbTracker = new BrbTracker(brbExtended);

    // Use up BRB with general income
    brbTracker.use(salary - personalAllowance); // 100800 - 12570 = 88230
    // Remaining BRB = 97700 - 88230 = 9470

    // Act
    const result = service.calculateSavingsTax(
      untaxedInterest,
      grossNonSavingsIncome,
      personalAllowance,
      brbTracker
    );

    // Assert
    // Savings income = 10,000 ? 9470 at basic, 530 at higher
    const savingsZero = result.find(b => b.rate === 0);
    expect(savingsZero).toBeDefined();
    expect(savingsZero?.amount).toBe(500); // £500 savings allowance

    const savingsBasic = result.find(b => b.band === TaxConstants.BasicBand && b.rate === TaxConstants.BasicRate);
    expect(savingsBasic).toBeDefined();
    expect(savingsBasic?.amount).toBe(8970); // 9470 - 500 = 8970 taxed at 20%
    expect(savingsBasic?.tax).toBeCloseTo(1794);

    const savingsHigher = result.find(b => b.band === TaxConstants.HigherBand && b.rate === TaxConstants.HigherRate);
    expect(savingsHigher).toBeDefined();
    expect(savingsHigher?.amount).toBe(530);
    expect(savingsHigher?.tax).toBeCloseTo(212);

    // Total savings tax: 1794 + 212 = 2006
    const totalSavingsTax = result.reduce((sum, b) => sum + b.tax, 0);
    expect(totalSavingsTax).toBeCloseTo(2006);
  });
});
