import { useState } from 'react';
import type { Asset } from '../types';
import { AssetCard } from '../components/AssetCard';

export default function Dashboard() {
    // 1. Setup mock data
    const [assets, setAssets] = useState<Asset[]>([
        { id: 1, symbol: 'AAPL', shares: 100, purchasePrice: 150, currentPrice: 175 },
        { id: 2, symbol: 'TSLA', shares: 500, purchasePrice: 240, currentPrice: 0 },
        { id: 3, symbol: 'VOO', shares: 20, purchasePrice: 350, currentPrice: 410 },
    ]);

    // 2. Calculating totals
    const totalValue = assets.reduce((acc, asset) => acc + (asset.shares * asset.currentPrice), 0);
    const totalCost  = assets.reduce((acc, asset) =>acc + (asset.shares * asset.purchasePrice), 0);
    const totalGainLoss = totalValue - totalCost;

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-2xl text-gray-900 mb-2">Stockpile - Investment Portfolio Tracker</h1>
                            <h2 className="text-sm text-gray-600">Track your investment holdings, monitor performance, and visualize growth overtime.</h2>
                        </div>
                        <button className="bg-emerald-800 text-white px-4 py-2 rounded-md shrink-0 ml-4 cursor-pointer">
                            Add Asset
                        </button>
                    </div>
                    <div className="flex justify-start gap-3 items-center">
                    <div className="mt-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500 tracking-wide">Total Value</p>
                        <p className="text-lg text-black">
                            ${totalValue.toLocaleString()}
                        </p>
                    </div>
                    <div className="mt-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500 tracking-wide">Total Cost</p>
                        <p className="text-lg text-black">
                            ${totalCost.toLocaleString()}
                        </p>
                    </div>
                    <div className="mt-4 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                        <p className="text-sm text-gray-500 tracking-wide">Total Gain / Loss</p>
                        <p className="text-lg text-black">
                            {totalGainLoss > 0 ? <span className="text-emerald-500"> {totalGainLoss.toLocaleString() }</span> : <span className="text-red-500"> ({(totalGainLoss * - 1).toLocaleString() })</span>}
                        </p>
                    </div>  
                    </div>
                </header>

                <main>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Current Holdings</h2>
                    <div className="grid gap-4">
                        {assets.map((asset) => (
                            <AssetCard key={asset.id} asset={asset} />
                        ))}
                    </div>
                </main>

            </div>
        </div>
    );
}
