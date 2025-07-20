import { EtfDataRes, PriceDataRes, FearAndGreedRes, NetworkDataRes } from './fetch';

export const writeReport = (args: {
  etfData: EtfDataRes | null;
  priceData: PriceDataRes | null;
  fearAndGreedData: FearAndGreedRes | null;
  networkData: NetworkDataRes | null;
}) => {
  const numberFormatter = new Intl.NumberFormat('en-US');

  const usdFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const eurFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formatNumber = (value: number | string | undefined): string => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    return isNaN(numValue) ? 'N/A' : numberFormatter.format(numValue);
  };

  const formatCurrency = (value: number | string | undefined, formatter: Intl.NumberFormat): string => {
    if (value === null || value === undefined) return 'N/A';
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
    return isNaN(numValue) ? 'N/A' : formatter.format(numValue);
  };

  return (
    `🟠 *BITCOIN DAILY RECAP* 🟠\n\n` +
    `💰 *Current Price*\n` +
    `├ 🇺🇸 ${formatCurrency(args.priceData?.usd, usdFormatter)}\n` +
    `└ 🇪🇺 ${formatCurrency(args.priceData?.eur, eurFormatter)}\n\n` +
    `📈 *ETF Activity*\n` +
    `└ Net Inflow (${args.etfData?.date ?? 'N/A'}): ${formatCurrency(
      args.etfData?.total,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
    )}\n\n` +
    `🎯 *Market Sentiment*\n` +
    `└ Fear & Greed: ${formatNumber(args.fearAndGreedData?.value)}/100\n` +
    `└ Status: ${getFearAndGreedEmoji(args.fearAndGreedData?.classification)} ${args.fearAndGreedData?.classification ?? 'N/A'}\n\n` +
    `⚡ *Network Health*\n` +
    `├ 🌐 Active Nodes: ${formatNumber(args.networkData?.totalNodes)}\n` +
    `└ 📦 Block Height: ${formatNumber(args.networkData?.blockHeight)}\n\n`
  );
};

const getFearAndGreedEmoji = (classification: string | undefined) => {
  if (!classification) {
    return;
  }

  const emojiMap: Record<string, string> = {
    'Extreme Fear': '😨',
    Fear: '😰',
    Neutral: '😐',
    Greed: '🤑',
    'Extreme Greed': '🔥',
  };

  return emojiMap[classification] || '📊';
};
