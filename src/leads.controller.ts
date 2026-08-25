import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    const take = +limit;
    const skip = (+page - 1) * take;
    const where = { deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.lead.count({ where }),
    ]);
    return { data, total, page: +page, limit: take };
  }

  @Post()
  create(@Body() body: any) {
    const { name, email, phone, notes } = body;
    if (!name) throw new BadRequestException('name is required');
    return this.prisma.lead.create({ data: { name, email, phone, notes } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const key of ['name', 'email', 'phone', 'notes', 'status']) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    return this.prisma.lead.update({ where: { id: +id }, data });
  }

  // Client intake -> matter tracking, the actual pitch. One click: mark the
  // lead converted and create the Client record in one action, same "one
  // click, several consequences" shape used everywhere else in this catalog.
  @Post(':id/convert')
  async convert(@Param('id') id: string) {
    const lead = await this.prisma.lead.findUnique({ where: { id: +id } });
    if (!lead) throw new BadRequestException('Lead not found');
    const client = await this.prisma.client.create({
      data: { name: lead.name, email: lead.email, phone: lead.phone, notes: lead.notes },
    });
    await this.prisma.lead.update({ where: { id: +id }, data: { status: 'converted' } });
    return client;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.lead.update({ where: { id: +id }, data: { deletedAt: new Date() } });
  }
}
