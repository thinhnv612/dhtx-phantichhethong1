import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { MenuItemIngredient } from './menu-item-ingredient.entity';
import { MenuItemsController } from './menu-items.controller';
import { MenuItemsService } from './menu-items.service';
@Module({ imports: [TypeOrmModule.forFeature([MenuItem, MenuItemIngredient])], controllers: [MenuItemsController], providers: [MenuItemsService], exports: [MenuItemsService, TypeOrmModule] })
export class MenuItemsModule {}
