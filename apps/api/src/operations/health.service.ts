import { Injectable } from "@nestjs/common";

export interface ReadinessCheck {
  readonly name: string;
  readonly status: "up" | "down";
}

export interface ReadinessResult {
  readonly checks: readonly ReadinessCheck[];
  readonly ready: boolean;
}

export type ReadinessProbe = () => Promise<ReadinessResult>;

const processReadinessProbe: ReadinessProbe = () =>
  Promise.resolve({
    checks: [{ name: "process", status: "up" }],
    ready: true,
  });

@Injectable()
export class HealthService {
  private probe: ReadinessProbe = processReadinessProbe;

  setReadinessProbe(probe: ReadinessProbe): void {
    this.probe = probe;
  }

  async readReadiness(): Promise<ReadinessResult> {
    try {
      return await this.probe();
    } catch {
      return {
        checks: [{ name: "runtime_dependencies", status: "down" }],
        ready: false,
      };
    }
  }
}
