import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20', @Query('matterId') matterId?: string) {
    const take = +limit;
    const skip = (+page - 1) * take;
    const where: any = {};
    if (matterId) where.matterId = +matterId;
    const [data, total] = await Promise.all([
      this.prisma.contract.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { matter: true } }),
      this.prisma.contract.count({ where }),
    ]);
    return { data, total, page: +page, limit: take };
  }

  @Post()
  create(@Body() body: any) {
    const { matterId, title, retainerAmount, body: text } = body;
    if (!matterId || !title) throw new BadRequestException('matterId and title are required');
    return this.prisma.contract.create({
      data: { matterId: +matterId, title, retainerAmount: retainerAmount ?? 0, body: text },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    for (const key of ['title', 'status', 'body']) {
      if (body[key] !== undefined) data[key] = body[key];
    }
    if (body.retainerAmount !== undefined) data.retainerAmount = body.retainerAmount;
    if (body.status === 'ended') data.endDate = new Date();
    return this.prisma.contract.update({ where: { id: +id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.contract.delete({ where: { id: +id } });
  }
}
