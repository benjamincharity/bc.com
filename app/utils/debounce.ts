export class InclusiveDebounce {
  public callback: () => void;
  public threshold: number;
  private lastTrigger: number = 0;
  private timeout: NodeJS.Timeout | null = null;

  public constructor(callback: () => void, threshold: number = 200) {
    this.callback = callback;
    this.threshold = threshold;
  }

  public run(): void {
    const now: number = Date.now();
    const diff: number = now - this.lastTrigger;

    // Execute Immediately
    if (diff > this.threshold) {
      this.lastTrigger = now;
      this.callback();
    }

    // Cancel future event, if exists
    if (this.timeout !== null) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }

    // Create a future event
    this.timeout = setTimeout(this.callback, this.threshold) as NodeJS.Timeout;
  }
}
