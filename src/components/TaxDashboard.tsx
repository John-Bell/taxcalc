import { useState, useEffect } from 'react';
import { TaxCalculationService } from '../services/TaxCalculationService';
import type { TaxCalculationResult } from '../models/TaxCalculationResult';

export const TaxDashboard = () => {
    // State for inputs
    const [salary, setSalary] = useState(0);
    const [rentalIncome, setRentalIncome] = useState(0);
    const [pensionIncome, setPensionIncome] = useState(0);
    const [pensionContribution, setPensionContribution] = useState(0);
    const [dividends, setDividends] = useState(0);
    const [untaxedInterest, setUntaxedInterest] = useState(0);

    // State for calculation result
    const [result, setResult] = useState<TaxCalculationResult | null>(null);

    // Constants (Tax Year)
    const taxYear = "2025/26"; // Or fetch dynamically if needed

    useEffect(() => {
        const service = new TaxCalculationService(taxYear);
        const input = {
            salary,
            rentalIncome,
            pensionIncome,
            pensionContribution,
            dividends,
            untaxedInterest,
            directPensionContrib: pensionContribution, // Mapping dashboard input to service input
            otherIncome: 0
        };
        const calculationResult = service.calculateTax(input, taxYear);
        setResult(calculationResult);
    }, [salary, rentalIncome, pensionIncome, dividends, pensionContribution, untaxedInterest]);

    const totalIncome = result ?
        (salary + rentalIncome + pensionIncome + dividends + untaxedInterest) : 0;
    // Note: result.incomeBreakdown doesn't have a 'total' field directly, 
    // but we can calculate it or use the utility from models if we imported it.
    // For now, simple sum is fine as it matches inputs.

    // Derived values from service result
    const estimatedTax = result?.totalTax ?? 0;
    const taxableIncome = result?.taxableIncome ?? 0;

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#0d141b] dark:text-slate-100 min-h-screen font-sans">
            {/* Summary Cards Section - Compacted - Removed header to save space */}
            <div className="px-4 py-4 pt-6">
                <div className="bg-blue-600 p-4 rounded-xl shadow-lg shadow-blue-600/20 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Estimated Tax Due</p>
                            <h1 className="text-3xl font-bold mt-1">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(estimatedTax)}
                            </h1>
                        </div>
                        <div className="text-right">
                            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Effective Rate</p>
                            <p className="text-xl font-bold">
                                {result ? (result.effectiveTaxRate * 100).toFixed(1) : '0.0'}%
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 pt-3 border-t border-white/20">
                        <div className="flex-1 min-w-[100px]">
                            <p className="text-white/70 text-[10px] uppercase">Total Income</p>
                            <p className="text-sm font-semibold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(totalIncome)}
                            </p>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <p className="text-white/70 text-[10px] uppercase">Taxable Income</p>
                            <p className="text-sm font-semibold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(taxableIncome)}
                            </p>
                        </div>
                        <div className="flex-1 min-w-[100px]">
                            <p className="text-white/70 text-[10px] uppercase">Extended Band</p>
                            <p className="text-sm font-semibold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(result?.brbExtended ?? 50270)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Sections */}
            <div className="px-4 pb-4">
                <h3 className="text-[#0d141b] dark:text-white text-md font-bold leading-tight tracking-[-0.015em] mb-3 mt-2">Income Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Salary Input */}
                    <InputCard
                        label="Yearly Salary"
                        icon="payments"
                        iconColor="text-primary"
                        iconBg="bg-primary/10"
                        value={salary}
                        onChange={setSalary}
                    />

                    {/* Pension Contribution */}
                    <InputCard
                        label="Pension Contribution"
                        icon="volunteer_activism"
                        iconColor="text-rose-600"
                        iconBg="bg-rose-100"
                        value={pensionContribution}
                        onChange={setPensionContribution}
                    />

                    {/* Rental Income */}
                    <InputCard
                        label="Rental Income"
                        icon="real_estate_agent"
                        iconColor="text-orange-600"
                        iconBg="bg-orange-100"
                        value={rentalIncome}
                        onChange={setRentalIncome}
                    />

                    {/* Pension Income */}
                    <InputCard
                        label="Pension Income"
                        icon="savings"
                        iconColor="text-emerald-600"
                        iconBg="bg-emerald-100"
                        value={pensionIncome}
                        onChange={setPensionIncome}
                    />

                    {/* Dividends */}
                    <InputCard
                        label="Dividends"
                        icon="monitoring"
                        iconColor="text-purple-600"
                        iconBg="bg-purple-100"
                        value={dividends}
                        onChange={setDividends}
                    />

                    {/* Untaxed Interest */}
                    <InputCard
                        label="Untaxed Interest"
                        icon="account_balance"
                        iconColor="text-teal-600"
                        iconBg="bg-teal-100"
                        value={untaxedInterest}
                        onChange={setUntaxedInterest}
                    />
                </div>
            </div>

            {/* Income Breakdown Only (Metrics moved to top) */}
            <div className="px-4 pb-24 space-y-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-[#0d141b] dark:text-white text-sm font-bold mb-4">Income Breakdown</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">General Income</span>
                            <span className="text-xs font-bold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(result?.incomeBreakdown.generalIncome ?? 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Savings Income</span>
                            <span className="text-xs font-bold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(result?.incomeBreakdown.savingsIncome ?? 0)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Dividend Income</span>
                            <span className="text-xs font-bold">
                                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(result?.incomeBreakdown.dividendIncome ?? 0)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tab Bar (iOS Style) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around py-2 pb-6 z-50">
                <TabItem icon="dashboard" label="Summary" active />
                <TabItem icon="history" label="History" />
                <TabItem icon="receipt_long" label="Take Home" />
                <TabItem icon="settings" label="Settings" />
            </div>
        </div>
    );
};

// Helper Components
const InputCard = ({ label, icon, iconColor, iconBg, value, onChange }: any) => (
    <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className={`flex items-center justify-center rounded-lg ${iconBg} ${iconColor} shrink-0 size-12`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">{label}</label>
            <div className="flex items-center mt-1">
                <span className="text-lg font-medium mr-1 text-slate-400">£</span>
                <input
                    className="w-full border-none p-0 focus:ring-0 bg-transparent text-lg font-bold text-[#0d141b] dark:text-white outline-none"
                    placeholder="0.00"
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                />
            </div>
        </div>
    </div>
);


const TabItem = ({ icon, label, active }: any) => (
    <div className={`flex flex-col items-center ${active ? 'text-primary' : 'text-slate-400'} cursor-pointer`}>
        <span className="material-symbols-outlined">{icon}</span>
        <span className="text-[10px] mt-1 font-medium">{label}</span>
    </div>
);
