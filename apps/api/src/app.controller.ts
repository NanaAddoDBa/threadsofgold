import { Controller, Get } from "@nestjs/common";
import {
  serviceFoundationSchema,
  type ServiceFoundation,
} from "@threadsofgold/contracts/service";

const serviceFoundation = serviceFoundationSchema.parse({
  service: "threads-of-gold-api",
  status: "foundation",
  version: "0.1.0",
});

@Controller("v1")
export class AppController {
  @Get()
  getServiceFoundation(): ServiceFoundation {
    return serviceFoundation;
  }
}
