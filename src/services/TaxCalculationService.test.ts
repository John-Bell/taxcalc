import { TaxCalculationService } from './TaxCalculationService';
import { TaxConstants } from '../constants/taxConstants';
import type { TaxCalculationInput } from '../models/TaxCalculationInput';

describe('TaxCalculationService', () => {
  it('calculates tax for a basic rate taxpayer (salary, rental, savings, dividends)', () => {
    const service = new TaxCalculationService();
    const input: TaxCalculationInput = {
      salary: 30000,
      rentalIncome: 5000,
      pensionIncome: 0,
      untaxedInterest: 1000,
      dividends: 500,
      directPensionContrib: 0,
    };
    const result = service.calculateTax(input);
    expect(result.personalAllowance).toBe(TaxConstants.StandardPersonalAllowance);
    expect(result.brbExtended).toBe(TaxConstants.BasicRateBand);
    expect(result.incomeBreakdown.generalIncome).toBe(35000);
    expect(result.incomeBreakdown.savingsIncome).toBe(1000);
    expect(result.incomeBreakdown.dividendIncome).toBe(500);
    // General tax: (35000 - PA) * 0.20
    const generalTax = result.taxByBand.filter(b => b.type === 'General').reduce((sum, b) => sum + b.tax, 0);
    expect(generalTax).toBeCloseTo(4486, 0);
    // Savings tax: all covered by allowance
    const savingsTax = result.taxByBand.filter(b => b.type === 'Savings').reduce((sum, b) => sum + b.tax, 0);
    expect(savingsTax).toBe(0);
    // Dividend tax: all covered by allowance
    const dividendTax = result.taxByBand.filter(b => b.type === 'Dividends').reduce((sum, b) => sum + b.tax, 0);
    expect(dividendTax).toBe(0);
  });

  it('calculates tax for a high earner with personal allowance reduction', () => {
    const service = new TaxCalculationService();
    const input: TaxCalculationInput = {
      salary: 110000,
      rentalIncome: 0,
      pensionIncome: 0,
      untaxedInterest: 0,
      dividends: 0,
      directPensionContrib: 0,
    };
    const result = service.calculateTax(input);
    // Personal allowance should be reduced
    expect(result.personalAllowance).toBeLessThan(TaxConstants.StandardPersonalAllowance);
    expect(result.personalAllowance).toBeGreaterThan(0);
  });

  it('calculates tax for an additional rate taxpayer (no personal allowance)', () => {
    const service = new TaxCalculationService();
    const input: TaxCalculationInput = {
      salary: 150000,
      rentalIncome: 0,
      pensionIncome: 0,
      untaxedInterest: 5000,
      dividends: 10000,
      directPensionContrib: 0,
    };
    const result = service.calculateTax(input);
    expect(result.personalAllowance).toBe(0);
    expect(result.brbExtended).toBe(TaxConstants.BasicRateBand);
    expect(result.incomeBreakdown.generalIncome).toBe(150000);
    expect(result.incomeBreakdown.savingsIncome).toBe(5000);
    expect(result.incomeBreakdown.dividendIncome).toBe(10000);
    // Should have nonzero tax in all bands
    const generalTax = result.taxByBand.filter(b => b.type === 'General').reduce((sum, b) => sum + b.tax, 0);
    expect(generalTax).toBeGreaterThan(0);
    const savingsTax = result.taxByBand.filter(b => b.type === 'Savings').reduce((sum, b) => sum + b.tax, 0);
    expect(savingsTax).toBeGreaterThan(0);
    const dividendTax = result.taxByBand.filter(b => b.type === 'Dividends').reduce((sum, b) => sum + b.tax, 0);
    expect(dividendTax).toBeGreaterThan(0);
  });

  it('calculates tax with extended basic rate band due to pension contributions', () => {
    const service = new TaxCalculationService();
    const input: TaxCalculationInput = {
      salary: 110270,
      rentalIncome: 0,
      pensionIncome: 0,
      untaxedInterest: 0,
      dividends: 0,
      directPensionContrib: 60000,
    };
    const result = service.calculateTax(input);
    expect(result.personalAllowance).toBe(TaxConstants.StandardPersonalAllowance);
    expect(result.brbExtended).toBe(TaxConstants.BasicRateBand + 60000);
    // All tax should be at 20%
    const generalBands = result.taxByBand.filter(b => b.type === 'General');
    const basicRateTax = generalBands.filter(b => b.rate === TaxConstants.BasicRate).reduce((sum, b) => sum + b.tax, 0);
    expect(result.totalTax).toBeCloseTo(basicRateTax, 2);
    // No 40% tax
    expect(generalBands.some(b => b.rate === TaxConstants.HigherRate)).toBe(false);
  });

  it('calculates tax for a complex scenario (rental, savings, dividends, pension contrib)', () => {
    const service = new TaxCalculationService();
    const input: TaxCalculationInput = {
      salary: 0,
      rentalIncome: 25000,
      pensionIncome: 0,
      untaxedInterest: 2000,
      dividends: 20000,
      directPensionContrib: 5000,
    };
    const result = service.calculateTax(input);
    // Check income breakdown
    expect(result.incomeBreakdown.generalIncome).toBe(25000);
    expect(result.incomeBreakdown.savingsIncome).toBe(2000);
    expect(result.incomeBreakdown.dividendIncome).toBe(20000);
    // Check brb extension
    expect(result.brbExtended).toBe(TaxConstants.BasicRateBand + 5000);
    // Should have nonzero tax in all bands
    const generalTax = result.taxByBand.filter(b => b.type === 'General').reduce((sum, b) => sum + b.tax, 0);
    expect(generalTax).toBeGreaterThan(0);
    const savingsTax = result.taxByBand.filter(b => b.type === 'Savings').reduce((sum, b) => sum + b.tax, 0);
    expect(savingsTax).toBeGreaterThan(0);
    const dividendTax = result.taxByBand.filter(b => b.type === 'Dividends').reduce((sum, b) => sum + b.tax, 0);
    expect(dividendTax).toBeGreaterThan(0);
  });
});
