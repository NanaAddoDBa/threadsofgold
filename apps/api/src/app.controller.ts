import { Controller, Get } from "@nestjs/common";

@Controller("v1")
export class AppController {
  @Get()
  getServiceFoundation() {
    return {
      service: "threads-of-gold-api",
      status: "foundation",
      version: "0.1.0",
    } as const;
  }
}
