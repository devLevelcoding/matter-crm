import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Matter creation optionally takes an inline checklist array, same
// one-call-creates-a-group-and-its-tasks shape Garage CRM (#06) established
// for job checklists.
@Controller('matters')
export class MattersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20', @Query('clientId') clientId?: string, @Query('status') status?: string) {
    const take = +limit;
    const skip = (+page - 1) * take;
    const where: any = {};
    if (clientId) where.clientId = +clientId;
    if (status) where.status = status;
    const [data, total] = await Promise.all([
      this.prisma.matter.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { client: true } }),
      this.prisma.matter.count({ where }),
    ]);
    return { data, total, page: +page, limit: take };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.matter.findUnique({
      where: { id: +id },
      include: { client: true, groups: { include: { tasks: true } }, contracts: true, invoices: true },
    });
  }

  @Post()
  async create(@Body() body: any) {
    const { clientId, title, type, notes, checklist } = body;
    if (!clientId || !title) throw new BadRequestException('clientId and title are required');
    const matter = await this.prisma.matter.create({ data: { clientId: +clientId, title, type, notes } });

    if (Array.isArray(checklist) && checklist.length > 0) {
      const group = await this.prisma.taskGroup.create({ data: { matterId: matter.id, name: 'Checklist' } });
      for (const item of checklist) {
        await this.prisma.checklistTask.create({ data: { groupId: group.id, title: String(item) } });
      }
    }

    return matter;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const key of ['title', 'type', 'status', 'notes']) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (body.status === 'closed') data.closedAt = new Date();
    return this.prisma.matter.update({ where: { id: +id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.matter.delete({ where: { id: +id } });
  }
}

@Controller('checklist-tasks')
export class ChecklistTasksController {
  constructor(private readonly prisma: PrismaService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: { status: string }) {
    return this.prisma.checklistTask.update({ where: { id: +id }, data: { status: body.status } });
  }
}
