import { Injectable } from "@nestjs/common";

export interface WorkerReadinessCheck {
  readonly name: string;
  readonly status: "up" | "down";
}

export interface WorkerReadinessResult {
  readonly checks: readonly WorkerReadinessCheck[];
  readonly ready: boolean;
}

export type WorkerReadinessProbe = () => Promise<WorkerReadinessResult>;

const processReadinessProbe: WorkerReadinessProbe = () =>
  Promise.resolve({
    checks: [{ name: "process", status: "up" }],
    ready: true,
  });

@Injectable()
export class WorkerReadinessService {
  private probe: WorkerReadinessProbe = processReadinessProbe;

  setProbe(probe: WorkerReadinessProbe): void {
    this.probe = probe;
  }

  async read(): Promise<WorkerReadinessResult> {
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
