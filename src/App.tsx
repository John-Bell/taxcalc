import { useState, useEffect } from 'react';
import { TaxCalculationService } from './services/TaxCalculationService';
import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';
import InputField from './components/InputField';
import { useVault } from './useVault';
import { BackupPanel } from './exportImport';
import type { VaultV1 } from './model';

const initialInput: TaxCalculationInput = {
    salary: 0,
    rentalIncome: 0,
    pensionIncome: 0,
    untaxedInterest: 0,
    dividends: 0,
    directPensionContrib: 0,
};

const fields: { name: keyof TaxCalculationInput; label: string }[] = [
    { name: 'salary', label: 'Salary' },
    { name: 'rentalIncome', label: 'Rental Income' },
    { name: 'pensionIncome', label: 'Pension Income' },
    { name: 'untaxedInterest', label: 'Untaxed Interest' },
    { name: 'dividends', label: 'Dividends' },
    { name: 'directPensionContrib', label: 'Direct Pension Contributions' },
];
function App() {
    const [input, setInput] = useState<TaxCalculationInput>(initialInput);
    const [result, setResult] = useState<TaxCalculationResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [passphrase, setPassphrase] = useState<string | null>(null);

    useEffect(() => {
        const p = prompt('Enter passphrase to unlock vault') || null;
        if (p) setPassphrase(p);
    }, []);

    const vault: VaultV1 = { input, result };
    useVault(vault, (s) => {
        setInput(s.input);
        setResult(s.result);
    }, passphrase);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const service = new TaxCalculationService();
            setResult(service.calculateTax(input));
        } catch {
            setError('Calculation error. Please check your input.');
        }
    };

    const formatGBP = (value: number) =>
        value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' });

    return (
        <div className="calculator-container bg-white text-black">
            <h2 className="text-center text-2xl mb-6">UK Tax Calculator 2025/26</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-8">
                {fields.map(({ name, label }) => (
                    <InputField
                        key={name}
                        name={name}
                        label={label}
                        value={input[name] as number}
                        onChange={handleChange}
                    />
                ))}

                <button
                    type="submit"
                    className="block mx-auto mt-5 px-5 py-2 bg-blue-600 text-white rounded"
                >
                    Calculate
                </button>
                {error && <div className="text-red-600 text-center mt-2">{error}</div>}
            </form>

            {/* Results */}
            {result && (
                <div className="section results">
                    <h3 className="border-b-2 pb-1 mb-2 font-bold">Results</h3>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Personal Allowance:</span>
                        <span>{formatGBP(result.personalAllowance)}</span>
                    </p>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Extended Basic Rate Band:</span>
                        <span>{formatGBP(result.brbExtended)}</span>
                    </p>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Total Tax:</span>
                        <span>{formatGBP(result.totalTax)}</span>
                    </p>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Effective Tax Rate:</span>
                        <span>{(result.effectiveTaxRate * 100).toFixed(2)}%</span>
                    </p>
                </div>
            )}

            {result && (
                <div className="section income mt-8">
                    <h3 className="border-b-2 pb-1 mb-2 font-bold">Income Breakdown</h3>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>General Income</span>
                        <span>{formatGBP(result.incomeBreakdown.generalIncome)}</span>
                    </p>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Savings Income</span>
                        <span>{formatGBP(result.incomeBreakdown.savingsIncome)}</span>
                    </p>
                    <p className="flex justify-between max-w-xs mx-auto">
                        <span>Dividend Income</span>
                        <span>{formatGBP(result.incomeBreakdown.dividendIncome)}</span>
                    </p>
                </div>
            )}

            <BackupPanel
                state={vault}
                setState={(s) => {
                    setInput(s.input);
                    setResult(s.result);
                }}
                passphrase={passphrase}
            />
        </div>
    );
}

export default App;
