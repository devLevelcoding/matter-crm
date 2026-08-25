import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll(@Query('page') page = '1', @Query('limit') limit = '20', @Query('matterId') matterId?: string) {
    const take = +limit;
    const skip = (+page - 1) * take;
    const where: any = {};
    if (matterId) where.matterId = +matterId;
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { matter: true } }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data, total, page: +page, limit: take };
  }

  @Post()
  async create(@Body() body: any) {
    const { matterId, contractId, amount, tax, dueDate } = body;
    if (!matterId || amount === undefined || !dueDate) throw new BadRequestException('matterId, amount, and dueDate are required');
    const count = await this.prisma.invoice.count({ where: { matterId: +matterId } });
    const number = `${matterId}-${String(count + 1).padStart(3, '0')}`;
    const taxAmount = tax ?? 0;
    return this.prisma.invoice.create({
      data: {
        matterId: +matterId,
        contractId: contractId ? +contractId : undefined,
        number,
        amount,
        tax: taxAmount,
        total: Number(amount) + Number(taxAmount),
        dueDate: new Date(dueDate),
      },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    if (body.status !== undefined) data.status = body.status;
    if (body.status === 'paid') data.paidAt = new Date();
    return this.prisma.invoice.update({ where: { id: +id }, data });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prisma.invoice.delete({ where: { id: +id } });
  }
}
