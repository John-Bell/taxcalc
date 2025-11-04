import type { TaxCalculationInput } from './models/TaxCalculationInput';

const zeroInput: TaxCalculationInput = {
    salary: 0,
    rentalIncome: 0,
    pensionIncome: 0,
    untaxedInterest: 0,
    dividends: 0,
    directPensionContrib: 0,
    otherIncome: 0,
};

export function createEmptyInput(): TaxCalculationInput {
    return { ...zeroInput };
}
