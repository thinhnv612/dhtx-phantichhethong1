import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupportService } from './support.service';
import { CreateSupportDto, ReplySupportDto } from './dto/support.dto';

@Controller('support')
export class SupportController {
  constructor(private service: SupportService) {}

  @Post()
  create(@Body() dto: CreateSupportDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.service.findAll();
  }

  @Post(':id/reply')
  @UseGuards(AuthGuard('jwt'))
  reply(@Param('id') id: string, @Body() replyDto: ReplySupportDto) {
    return this.service.reply(Number(id), replyDto.reply);
  }
}
