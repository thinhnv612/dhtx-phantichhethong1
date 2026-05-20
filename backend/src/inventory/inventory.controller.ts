import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from './dto';
import { InventoryService } from './inventory.service';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}
  @Get() findAll() { return this.inventory.findAll(); }
  @Post() create(@Body() dto: CreateInventoryItemDto) { return this.inventory.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateInventoryItemDto) { return this.inventory.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.inventory.remove(id); }
}
