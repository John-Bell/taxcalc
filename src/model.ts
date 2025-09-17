import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';

export interface VaultV1 {
    input: TaxCalculationInput;
    result: TaxCalculationResult | null;
}

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

export function createEmptyVault(): VaultV1 {
    return { input: createEmptyInput(), result: null };
}
