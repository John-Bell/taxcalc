import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';

export interface VaultV1 {
    input: TaxCalculationInput;
    result: TaxCalculationResult | null;
}
