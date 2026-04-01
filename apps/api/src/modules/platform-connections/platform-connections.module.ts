import { Module } from "@nestjs/common";

import { PlatformConnectionsController } from "./platform-connections.controller";
import { PlatformConnectionsService } from "./platform-connections.service";

@Module({
  controllers: [PlatformConnectionsController],
  providers: [PlatformConnectionsService],
})
export class PlatformConnectionsModule {}

