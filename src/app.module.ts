import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { LeadsController } from './leads.controller';
import { ClientsController } from './clients.controller';
import { MattersController, ChecklistTasksController } from './matters.controller';
import { ContractsController } from './contracts.controller';
import { InvoicesController } from './invoices.controller';

@Module({
  controllers: [
    LeadsController,
    ClientsController,
    MattersController,
    ChecklistTasksController,
    ContractsController,
    InvoicesController,
  ],
  providers: [PrismaService],
})
export class AppModule {}
