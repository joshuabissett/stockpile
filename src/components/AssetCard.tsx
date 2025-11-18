// src/components/AssetCard.tsx

import type { Asset } from '../types';

interface AssetCardProps {
    asset: Asset;
}

export function AssetCard({ asset }: AssetCardProps) {
    const value    = asset.shares * asset.currentPrice;
    const isProfit = asset.currentPrice >= asset.purchasePrice;

    return (
        <div className="bg-white p-4 rounded-none shadow-sm flex justify-between items-center border-l-4 border-emerald-500">
        <div>
          <h3 className="font-normal text-lg">{asset.symbol}</h3>
          <p className="text-gray-500 text-sm">{asset.shares} shares @ ${asset.purchasePrice}</p>
        </div>
        <div className="text-right">
          <p className="font-normal text-lg">${value.toLocaleString()}</p>
          <p className={`text-sm ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
            ${asset.currentPrice} (Current)
          </p>
        </div>
      </div>
    );
}