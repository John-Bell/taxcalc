import type { VaultV1 } from './model';
import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';
import type { TaxBandResult } from './models/TaxBandResult';

function isNumber(n: unknown): n is number {
    return typeof n === 'number' && Number.isFinite(n);
}

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isTaxBandResult(value: unknown): value is TaxBandResult {
    return (
        isObject(value) &&
        typeof value.band === 'string' &&
        typeof value.type === 'string' &&
        isNumber(value.amount) &&
        isNumber(value.rate) &&
        isNumber(value.tax)
    );
}

export function parseVault(data: unknown): VaultV1 {
    if (!isObject(data)) throw new Error('Invalid vault');
    const { input, result } = data as { input?: unknown; result?: unknown };

    if (!isObject(input)) throw new Error('Invalid vault');
    const inputRecord: Record<string, unknown> = input;
    const required: (keyof TaxCalculationInput)[] = [
        'salary',
        'rentalIncome',
        'pensionIncome',
        'untaxedInterest',
        'dividends',
        'directPensionContrib',
    ];
    for (const key of required) {
        if (!isNumber(inputRecord[key])) throw new Error('Invalid vault');
    }
    const parsedInput: TaxCalculationInput = {
        salary: inputRecord.salary as number,
        rentalIncome: inputRecord.rentalIncome as number,
        pensionIncome: inputRecord.pensionIncome as number,
        untaxedInterest: inputRecord.untaxedInterest as number,
        dividends: inputRecord.dividends as number,
        directPensionContrib: inputRecord.directPensionContrib as number,
    };
    if (isNumber(inputRecord.otherIncome)) {
        parsedInput.otherIncome = inputRecord.otherIncome;
    }

    let parsedResult: TaxCalculationResult | null = null;
    if (result !== null && result !== undefined) {
        if (!isObject(result)) throw new Error('Invalid vault');
        const resultRecord: Record<string, unknown> = result;
        const numericKeys: (keyof Pick<
            TaxCalculationResult,
            'personalAllowance' | 'brbExtended' | 'totalTax' | 'effectiveTaxRate'
        >)[] = ['personalAllowance', 'brbExtended', 'totalTax', 'effectiveTaxRate'];
        for (const key of numericKeys) {
            if (!isNumber(resultRecord[key])) throw new Error('Invalid vault');
        }
        if (!isObject(resultRecord.incomeBreakdown)) throw new Error('Invalid vault');
        const incomeRecord = resultRecord.incomeBreakdown as Record<string, unknown>;
        if (
            !isNumber(incomeRecord.generalIncome) ||
            !isNumber(incomeRecord.savingsIncome) ||
            !isNumber(incomeRecord.dividendIncome)
        ) {
            throw new Error('Invalid vault');
        }
        let taxByBand: TaxBandResult[] = [];
        if (resultRecord.taxByBand !== undefined) {
            if (!Array.isArray(resultRecord.taxByBand)) throw new Error('Invalid vault');
            taxByBand = resultRecord.taxByBand.filter(isTaxBandResult);
            if (taxByBand.length !== resultRecord.taxByBand.length) throw new Error('Invalid vault');
        }

        const baseResult: TaxCalculationResult = {
            personalAllowance: resultRecord.personalAllowance as number,
            brbExtended: resultRecord.brbExtended as number,
            totalTax: resultRecord.totalTax as number,
            effectiveTaxRate: resultRecord.effectiveTaxRate as number,
            incomeBreakdown: {
                generalIncome: incomeRecord.generalIncome as number,
                savingsIncome: incomeRecord.savingsIncome as number,
                dividendIncome: incomeRecord.dividendIncome as number,
            },
            taxByBand,
        };
        if (isNumber(resultRecord.taxableIncome)) {
            baseResult.taxableIncome = resultRecord.taxableIncome;
        }
        parsedResult = baseResult;
    }

    return { input: parsedInput, result: parsedResult };
}
