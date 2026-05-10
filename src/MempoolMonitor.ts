import { ethers } from "ethers";

interface PendingTx {
  hash: string;
  from: string;
  to: string | null;
  value: bigint;
  gasPrice: bigint;
  data: string;
  timestamp: number;
}

interface SandwichAlert {
  victimTx: string;
  frontrunTx: string;
  backrunTx: string;
  profitEth: number;
}

export class MempoolMonitor {
  private provider: ethers.WebSocketProvider;
  private pendingTxs: Map<string, PendingTx> = new Map();
  private sandwiches: SandwichAlert[] = [];

  constructor(wsUrl: string) {
    this.provider = new ethers.WebSocketProvider(wsUrl);
  }

  async start(onTx?: (tx: PendingTx) => void) {
    console.log("Starting Base mempool monitor...");
    this.provider.on("pending", async (txHash: string) => {
      try {
        const tx = await this.provider.getTransaction(txHash);
        if (!tx) return;
        const pending: PendingTx = {
          hash: txHash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          gasPrice: tx.gasPrice ?? BigInt(0),
          data: tx.data,
          timestamp: Date.now(),
        };
        this.pendingTxs.set(txHash, pending);
        this.detectSandwich(pending);
        if (onTx) onTx(pending);
      } catch {}
    });
  }

  private detectSandwich(tx: PendingTx) {
    const SWAP_SELECTOR = "0x5ae401dc"; // Uniswap multicall
    if (!tx.data.startsWith(SWAP_SELECTOR)) return;
    const recentSwaps = Array.from(this.pendingTxs.values())
      .filter(t => t.data.startsWith(SWAP_SELECTOR) && t.hash !== tx.hash && Date.now() - t.timestamp < 2000);
    if (recentSwaps.length > 0) {
      console.log(`⚠️  Potential sandwich: ${recentSwaps[0].hash} → ${tx.hash}`);
    }
  }

  getStats() {
    return {
      pendingCount: this.pendingTxs.size,
      sandwichCount: this.sandwiches.length,
      avgGasGwei: Array.from(this.pendingTxs.values())
        .reduce((acc, tx) => acc + Number(tx.gasPrice) / 1e9, 0) / this.pendingTxs.size,
    };
  }

  stop() { this.provider.destroy(); }
}

// Main
const monitor = new MempoolMonitor(process.env.BASE_WS_RPC || "wss://mainnet.base.org");
monitor.start(tx => {
  if (tx.value > ethers.parseEther("1")) {
    console.log(`🐋 Whale tx: ${tx.hash} — ${ethers.formatEther(tx.value)} ETH`);
  }
});