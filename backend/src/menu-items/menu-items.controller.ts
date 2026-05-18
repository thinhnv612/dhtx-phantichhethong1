import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMenuItemDto, UpdateMenuItemDto } from './dto';
import { MenuItemsService } from './menu-items.service';
@ApiTags('menu-items')
@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItems: MenuItemsService) {}
  @Get() findByRestaurant(@Query('restaurantId') restaurantId: string) { return this.menuItems.findByRestaurant(restaurantId); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post() create(@Body() dto: CreateMenuItemDto) { return this.menuItems.create(dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) { return this.menuItems.update(id, dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Delete(':id') remove(@Param('id') id: string) { return this.menuItems.remove(id); }
}
