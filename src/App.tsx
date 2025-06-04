import { useState } from 'react';
import { TaxCalculationService } from './services/TaxCalculationService';
import type { TaxCalculationInput } from './models/TaxCalculationInput';
import type { TaxCalculationResult } from './models/TaxCalculationResult';
import './App.css';

const initialInput: TaxCalculationInput = {
    salary: 0,
    rentalIncome: 0,
    pensionIncome: 0,
    untaxedInterest: 0,
    dividends: 0,
    directPensionContrib: 0,
};
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

            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-8">
                    <div className="grid grid-cols-12 gap-y-4 gap-x-4">
                        {/* Salary */}
                        <label
                            htmlFor="salary"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Salary
                        </label>
                        <input
                            id="salary"
                            name="salary"
                            type="number"
                            min="0"
                            value={input.salary}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />

                        {/* Rental Income */}
                        <label
                            htmlFor="rentalIncome"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Rental Income
                        </label>
                        <input
                            id="rentalIncome"
                            name="rentalIncome"
                            type="number"
                            min="0"
                            value={input.rentalIncome}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />

                        {/* Pension Income */}
                        <label
                            htmlFor="pensionIncome"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Pension Income
                        </label>
                        <input
                            id="pensionIncome"
                            name="pensionIncome"
                            type="number"
                            min="0"
                            value={input.pensionIncome}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />

                        {/* Untaxed Interest */}
                        <label
                            htmlFor="untaxedInterest"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Untaxed Interest
                        </label>
                        <input
                            id="untaxedInterest"
                            name="untaxedInterest"
                            type="number"
                            min="0"
                            value={input.untaxedInterest}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />

                        {/* Dividends */}
                        <label
                            htmlFor="dividends"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Dividends
                        </label>
                        <input
                            id="dividends"
                            name="dividends"
                            type="number"
                            min="0"
                            value={input.dividends}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />

                        {/* Direct Pension Contributions */}
                        <label
                            htmlFor="directPensionContrib"
                            className="col-start-4 col-span-2 text-right text-gray-700 font-medium"
                        >
                            Direct Pension Contributions
                        </label>
                        <input
                            id="directPensionContrib"
                            name="directPensionContrib"
                            type="number"
                            min="0"
                            value={input.directPensionContrib}
                            onChange={handleChange}
                            className="col-start-7 col-span-3 w-full text-right px-3 py-2 border rounded focus:ring-2"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-6 bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Calculate
                    </button>
                    {error && <div className="text-red-600 mt-2">{error}</div>}
                </form>


                {/* Results */}
                {result && (
                    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl self-start">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">Results</h2>
                        <div className="space-y-2 text-left">
                            <div>
                                <span className="font-semibold">Personal Allowance:</span>{' '}
                                {formatGBP(result.personalAllowance)}
                            </div>
                            <div>
                                <span className="font-semibold">Extended Basic Rate Band:</span>{' '}
                                {formatGBP(result.brbExtended)}
                            </div>
                            <div>
                                <span className="font-semibold">Total Tax:</span>{' '}
                                {formatGBP(result.totalTax)}
                            </div>
                            <div>
                                <span className="font-semibold">Effective Tax Rate:</span>{' '}
                                {(result.effectiveTaxRate * 100).toFixed(2)}%
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
