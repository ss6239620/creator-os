import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BillingModule } from "./modules/billing/billing.module";
import { ContentModule } from "./modules/content/content.module";
import { PlatformConnectionsModule } from "./modules/platform-connections/platform-connections.module";
import { RevenueModule } from "./modules/revenue/revenue.module";
import { UsersModule } from "./modules/users/users.module";
import { WebhooksModule } from "./modules/webhooks/webhooks.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PlatformConnectionsModule,
    AnalyticsModule,
    ContentModule,
    RevenueModule,
    WebhooksModule,
    BillingModule,
  ],
})
export class AppModule {}

