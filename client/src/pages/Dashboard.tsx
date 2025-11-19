import { useState, useEffect } from 'react';
import type { Asset } from '../types';
import { AssetCard } from '../components/AssetCard';
import { AssetForm } from '../components/AssetForm';

interface DashboardProps {
    user: { id: number; email: string };
    onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssets();
    }, [user.id]);

    const fetchAssets = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/assets?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setAssets(data);
            }
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalValue = assets.reduce((acc, asset) => acc + (asset.shares * asset.currentPrice), 0);
    const totalCost  = assets.reduce((acc, asset) => acc + (asset.shares * asset.purchasePrice), 0);
    const totalGainLoss = totalValue - totalCost;

    const handleAddAsset = async (newAssetData: Omit<Asset, 'id'>) => {
        try {
            const response = await fetch('http://localhost:3001/api/assets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    ...newAssetData
                }),
            });

            if (response.ok) {
                const savedAsset = await response.json();
                setAssets([savedAsset, ...assets]);
                setIsModalOpen(false);
            }
        } catch (error) {
            alert('Failed to add asset');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <h1 className="text-2xl text-gray-900 mb-2">Stockpile</h1>
                            <p className="text-sm text-gray-600">Welcome, {user.email}</p>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-emerald-800 text-white px-4 py-2 rounded-md hover:bg-emerald-900 transition-colors"
                            >
                                Add Asset
                            </button>
                            <button 
                                onClick={onLogout}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-start gap-3 items-center mt-6">
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-500 tracking-wide">Total Value</p>
                            <p className="text-lg text-black">${totalValue.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-500 tracking-wide">Total Cost</p>
                            <p className="text-lg text-black">${totalCost.toLocaleString()}</p>
                        </div>
                        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
                            <p className="text-sm text-gray-500 tracking-wide">Total Gain / Loss</p>
                            <p className="text-lg text-black">
                                {totalGainLoss > 0 ? 
                                    <span className="text-emerald-500">+${totalGainLoss.toLocaleString()}</span> : 
                                    <span className="text-red-500">-${Math.abs(totalGainLoss).toLocaleString()}</span>
                                }
                            </p>
                        </div>  
                    </div>
                </header>

                <main>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Current Holdings</h2>
                    
                    {isLoading ? (
                        <p>Loading assets...</p>
                    ) : assets.length === 0 ? (
                        <p className="text-gray-500">No assets yet. Click "Add Asset" to start!</p>
                    ) : (
                        <div className="grid gap-4">
                            {assets.map((asset) => (
                                <AssetCard key={asset.id} asset={asset} />
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {isModalOpen && (
                <AssetForm 
                    onSubmit={handleAddAsset} 
                    onCancel={() => setIsModalOpen(false)} 
                />
            )}
        </div>
    );
}
