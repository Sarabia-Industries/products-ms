import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    this.logger.log(`Database connected`);
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page } = paginationDto;

    const totalPage = await this.product.count({
      where: {
        available: true,
      },
    });

    const lastPage = Math.ceil(totalPage / limit);

    const data = await this.product.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where: {
        available: true,
      },
    });

    return {
      data,
      meta: {
        total: totalPage,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!product)
      throw new RpcException({
        message: `Product with id #${id} not found`,
        status: HttpStatus.NOT_FOUND,
      });

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id } = updateProductDto;
    await this.findOne(id);

    return await this.product.update({
      where: {
        id,
      },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    await this.findOne(+id);

    const product = await this.product.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
    });

    return;
  }
}
