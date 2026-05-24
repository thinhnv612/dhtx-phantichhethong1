import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Type } from 'class-transformer';
import { IsArray, IsInt, Min, ValidateNested } from 'class-validator';
import { InventoryService } from './inventory.service';

class ImportItemDto { @IsInt() product_id: number; @IsInt() @Min(1) quantity: number; }
class ImportDto { @IsArray() @ValidateNested({ each: true }) @Type(() => ImportItemDto) items: ImportItemDto[]; }

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private service: InventoryService) {}

  @Post('import') 
  import(@Body() dto: ImportDto, @Req() req: any) { 
    return this.service.importStock(dto.items, req.user.sub); 
  }

  @Get('transactions')
  getTransactions() {
    return this.service.findAll();
  }
}
