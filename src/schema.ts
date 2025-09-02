import type { VaultV1 } from './model';

function isNumber(n: any): n is number {
    return typeof n === 'number' && Number.isFinite(n);
}

export function parseVault(data: unknown): VaultV1 {
    if (typeof data !== 'object' || data === null) throw new Error('Invalid vault');
    const anyData: any = data;
    const input = anyData.input;
    const result = anyData.result;

    const required = [
        'salary',
        'rentalIncome',
        'pensionIncome',
        'untaxedInterest',
        'dividends',
        'directPensionContrib',
    ];
    if (typeof input !== 'object' || input === null) throw new Error('Invalid vault');
    for (const k of required) {
        if (!isNumber((input as any)[k])) throw new Error('Invalid vault');
    }

    let parsedResult = null;
    if (result !== null && result !== undefined) {
        if (typeof result !== 'object') throw new Error('Invalid vault');
        const numbers = ['personalAllowance', 'brbExtended', 'totalTax', 'effectiveTaxRate'];
        for (const k of numbers) {
            if (!isNumber((result as any)[k])) throw new Error('Invalid vault');
        }
        const income = (result as any).incomeBreakdown;
        if (
            !income ||
            !isNumber(income.generalIncome) ||
            !isNumber(income.savingsIncome) ||
            !isNumber(income.dividendIncome)
        ) {
            throw new Error('Invalid vault');
        }
        parsedResult = result as any;
    }

    return { input: input as any, result: parsedResult };
}
