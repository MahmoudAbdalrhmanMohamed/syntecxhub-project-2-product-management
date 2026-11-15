import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'List products with search, category, price range, sorting, and pagination',
  })
  @ApiOkResponse({ description: 'Paginated products list returned' })
  findAll(@Query() query: QueryProductsDto) {
    return this.productsService.findAll(query);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List all available product categories' })
  @ApiOkResponse({ description: 'Distinct product categories returned' })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product by MongoDB ObjectId' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Product details returned' })
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product item in inventory' })
  @ApiCreatedResponse({ description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: product,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product by ID' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Product updated successfully' })
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'id', description: '24-character MongoDB ObjectId' })
  @ApiOkResponse({ description: 'Product deleted successfully' })
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    const result = await this.productsService.remove(id);
    return {
      message: 'Product deleted successfully',
      data: result,
    };
  }
}
