import { Controller } from "@nestjs/common";

import { PlatformConnectionsService } from "./platform-connections.service";

@Controller("platform-connections")
export class PlatformConnectionsController {
  constructor(
    private readonly platformConnectionsService: PlatformConnectionsService,
  ) {}
}

