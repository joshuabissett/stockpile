export interface Asset {
    id: number;
    symbol: string;
    shares: number;
    purchasePrice: number;
    currentPrice: number;
    boughtOn: string | null;
}