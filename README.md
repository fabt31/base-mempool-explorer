# base-mempool-explorer

> Base L2 Mempool Explorer & MEV Monitor

Real-time mempool monitoring for Base L2. Track pending transactions, detect sandwich attacks and frontrunning, analyze MEV bundle activity, and visualize gas price trends.

## Features
- 📡 Real-time pending transaction feed via WebSocket
- 🥪 Sandwich attack detector
- 🏃 Frontrunning detection algorithm
- 📊 Gas price heatmap (gwei over time)
- 🤖 MEV bundle tracker (Flashbots)
- 🔍 Address-specific transaction monitor
- 📈 DEX volume from mempool

## Installation
```bash
git clone https://github.com/fabt31/base-mempool-explorer
cd base-mempool-explorer
npm install
cp .env.example .env
npm run start
```

## Environment
```env
BASE_WS_RPC=wss://base-mainnet.g.alchemy.com/v2/YOUR_KEY
ALERT_WEBHOOK=https://discord.com/api/webhooks/...
MIN_VALUE_ETH=0.1
```

## API
```
GET /api/pending        — list pending txs
GET /api/mev/sandwiches — detected sandwich attacks
GET /api/gas/history    — gas price history (1h/24h/7d)
WS  /ws/feed            — live transaction feed
```

## License
MIT