import { GasTracker } from "../src/gasTracker";
describe("GasTracker", () => {
  it("returns 0 when no snapshots", () => {
    const tracker = new GasTracker();
    expect(tracker.getAvgBaseFee()).toBe(0);
  });
});
