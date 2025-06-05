import { useState } from 'react';
import { TaxCalculationService } from './services/TaxCalculationService';
import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';
import InputField from './components/InputField';

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
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
                UK Tax Calculator 2025/26
            </h1>

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto">
                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map(({ name, label }) => (
                            <InputField
                                key={name}
                                name={name}
                                label={label}
                                value={input[name] as number}
                                onChange={handleChange}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Calculate
                    </button>
                    {error && <div className="text-red-600">{error}</div>}
                </form>


                {/* Results */}
                {result && (
                    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl self-center">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Results</h2>
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="font-semibold">Personal Allowance:</span>
                                <span>{formatGBP(result.personalAllowance)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Extended Basic Rate Band:</span>
                                <span>{formatGBP(result.brbExtended)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Total Tax:</span>
                                <span>{formatGBP(result.totalTax)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Effective Tax Rate:</span>
                                <span>{(result.effectiveTaxRate * 100).toFixed(2)}%</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-blue-700 mt-6 mb-2">
                            Income Breakdown
                        </h3>
                        <div className="space-y-1 text-left">
                            <div>
                                General Income: {formatGBP(result.incomeBreakdown.generalIncome)}
                            </div>
                            <div>
                                Savings Income: {formatGBP(result.incomeBreakdown.savingsIncome)}
                            </div>
                            <div>
                                Dividend Income: {formatGBP(result.incomeBreakdown.dividendIncome)}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
