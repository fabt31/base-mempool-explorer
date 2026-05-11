import { ethers } from "ethers";
export interface GasSnapshot { timestamp: number; baseFee: bigint; priorityFee: bigint; }
export class GasTracker {
  private history: GasSnapshot[] = [];
  async recordSnapshot(provider: ethers.JsonRpcProvider) {
    const block = await provider.getBlock("latest");
    if (!block) return;
    const feeData = await provider.getFeeData();
    this.history.push({ timestamp: Date.now(), baseFee: block.baseFeePerGas ?? BigInt(0), priorityFee: feeData.maxPriorityFeePerGas ?? BigInt(0) });
    if (this.history.length > 1440) this.history.shift(); // 24h at 1min intervals
  }
  getAvgBaseFee(hours = 1): number {
    const cutoff = Date.now() - hours * 3600 * 1000;
    const recent = this.history.filter(s => s.timestamp > cutoff);
    if (!recent.length) return 0;
    return Number(recent.reduce((a, s) => a + s.baseFee, BigInt(0)) / BigInt(recent.length)) / 1e9;
  }
}
