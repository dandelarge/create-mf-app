import { BuildStrategy } from "./types";

export default class BuildContext {
  strategy: BuildStrategy | undefined;

  setStrategy(strategy: BuildStrategy) {
    this.strategy = strategy;
  }

  async exec() {
    if (!this.strategy) {
      console.log('There should be a Strategy here');
      return;
    }

    await this.strategy.build();

  }
}