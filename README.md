# Bitcoin WhatsApp Bot

A TypeScript bot that sends a daily Bitcoin market recap to your WhatsApp group at 9:00 AM Rome time. The recap includes price, ETF activity, market sentiment, and network health, all fetched from public APIs.

## Features

- 📈 Fetches Bitcoin price (USD/EUR)
- 💰 Tracks Bitcoin ETF net inflow
- 🎯 Reports Fear & Greed Index
- ⚡ Shows network health (active nodes, block height)
- 🕘 Sends a formatted WhatsApp message to your group every morning at 9:00 AM (Europe/Rome)

## Setup

### 1. Clone the repository

```sh
git clone <your-repo-url>
cd bitcoin-whatsapp-bot
```

### 2. Install dependencies

```sh
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory with the following:

```env
WA_GROUP_NAME=Your WhatsApp Group Name
```

- `WA_GROUP_NAME`: The exact name of the WhatsApp group to send the recap to.

### 4. Run the bot

```sh
npm start
```

- On first run, scan the QR code with your WhatsApp app to authenticate.

## How it works

- The bot uses [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) to connect to WhatsApp Web.
- Every day at 9:00 AM (Europe/Rome), it fetches:
  - Bitcoin price from CoinPaprika
  - ETF net inflow from bitcoin-etf-data
  - Fear & Greed Index from alternative.me
  - Network stats from Bitnodes
- It formats the data into a clear WhatsApp message and sends it to your group.

### Example Message

```md
🟠 BITCOIN DAILY RECAP 🟠

💰 Current Price
├ 🇺🇸 $67,000.00
└ 🇪🇺 €61,000.00

📈 ETF Activity
└ Net Inflow (2024-06-01): $150,000,000

🎯 Market Sentiment
└ Fear & Greed: 72/100
└ Status: 🤑 Greed

⚡ Network Health
├ 🌐 Active Nodes: 18,000
└ 📦 Block Height: 800,000
```

## Formatting

- Code is formatted with [Prettier](https://prettier.io/).
- To format all files:

```sh
npm run fmt
```

## License

ISC
