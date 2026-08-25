import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    const take = +limit;
    const skip = (+page - 1) * take;
    const where = { deletedAt: null };
    const [data, total] = await Promise.all([
      this.prisma.client.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.client.count({ where }),
    ]);
    return { data, total, page: +page, limit: take };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prisma.client.findUnique({
      where: { id: +id },
      include: { matters: { include: { contracts: true, invoices: true } } },
    });
  }

  @Post()
  create(@Body() body: any) {
    const { name, email, phone, notes } = body;
    if (!name) throw new BadRequestException('name is required');
    return this.prisma.client.create({ data: { name, email, phone, notes } });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const key of ['name', 'email', 'phone', 'notes']) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    return this.prisma.client.update({ where: { id: +id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.client.update({ where: { id: +id }, data: { deletedAt: new Date() } });
  }
}
