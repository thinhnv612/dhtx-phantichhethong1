import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto';
import { RestaurantsService } from './restaurants.service';
@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurants: RestaurantsService) {}
  @Get() findAll(@Query('search') search?: string) { return this.restaurants.findAll(search); }
  @Get(':id') findOne(@Param('id') id: string) { return this.restaurants.findOne(id); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post() create(@Body() dto: CreateRestaurantDto) { return this.restaurants.create(dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) { return this.restaurants.update(id, dto); }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Delete(':id') remove(@Param('id') id: string) { return this.restaurants.remove(id); }
}
