import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { PaginatedResult } from '../common/interfaces/api-response.interface';
import { escapeRegExp } from '../common/utils/regex.util';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  PRODUCT_CATEGORIES,
  Product,
  ProductDocument,
  ProductStatus,
} from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  private deriveStatus(
    stockQuantity: number,
    requestedStatus?: ProductStatus,
  ): ProductStatus {
    if (requestedStatus === ProductStatus.ARCHIVED) {
      return ProductStatus.ARCHIVED;
    }
    if (stockQuantity <= 0) {
      return ProductStatus.OUT_OF_STOCK;
    }
    if (stockQuantity <= 10) {
      return ProductStatus.LOW_STOCK;
    }
    return requestedStatus || ProductStatus.IN_STOCK;
  }

  async findAll(
    query: QueryProductsDto,
  ): Promise<PaginatedResult<ProductDocument>> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ProductDocument> = {};

    if (query.search && query.search.trim()) {
      const safeRegex = new RegExp(escapeRegExp(query.search.trim()), 'i');
      filter.$or = [
        { name: safeRegex },
        { sku: safeRegex },
        { description: safeRegex },
        { category: safeRegex },
      ];
    }

    if (query.category && query.category.trim()) {
      filter.category = query.category.trim();
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      if (
        query.minPrice !== undefined &&
        query.maxPrice !== undefined &&
        query.minPrice > query.maxPrice
      ) {
        throw new BadRequestException(
          'minPrice cannot be greater than maxPrice.',
        );
      }
      filter.price = {};
      if (query.minPrice !== undefined) {
        filter.price.$gte = Number(query.minPrice);
      }
      if (query.maxPrice !== undefined) {
        filter.price.$lte = Number(query.maxPrice);
      }
    }

    const allowedSortFields = [
      'createdAt',
      'updatedAt',
      'name',
      'price',
      'stockQuantity',
      'category',
      'sku',
    ];
    const sortField = allowedSortFields.includes(query.sortBy)
      ? query.sortBy
      : 'createdAt';
    const sortDirection = query.sortOrder === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      this.productModel
        .find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async getCategories(): Promise<string[]> {
    const distinctCategories = await this.productModel.distinct('category').exec();
    return Array.from(new Set([...PRODUCT_CATEGORIES, ...distinctCategories]));
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    const normalizedSku = createProductDto.sku.trim().toUpperCase();
    const existing = await this.productModel
      .findOne({ sku: normalizedSku })
      .exec();

    if (existing) {
      throw new ConflictException(
        `A product with SKU "${normalizedSku}" already exists.`,
      );
    }

    const computedStatus = this.deriveStatus(
      createProductDto.stockQuantity,
      createProductDto.status,
    );

    const created = new this.productModel({
      ...createProductDto,
      sku: normalizedSku,
      status: computedStatus,
      image:
        createProductDto.image && createProductDto.image.trim()
          ? createProductDto.image.trim()
          : '/uploads/product-default.svg',
    });

    return created.save();
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const existingProduct = await this.findOne(id);

    if (updateProductDto.sku) {
      const normalizedSku = updateProductDto.sku.trim().toUpperCase();
      if (normalizedSku !== existingProduct.sku) {
        const skuTaken = await this.productModel
          .findOne({ sku: normalizedSku, _id: { $ne: id } })
          .exec();
        if (skuTaken) {
          throw new ConflictException(
            `Another product already uses SKU "${normalizedSku}".`,
          );
        }
      }
      updateProductDto.sku = normalizedSku;
    }

    const targetStock =
      updateProductDto.stockQuantity !== undefined
        ? updateProductDto.stockQuantity
        : existingProduct.stockQuantity;

    const nextStatus = this.deriveStatus(
      targetStock,
      updateProductDto.status ?? existingProduct.status,
    );

    const updated = await this.productModel
      .findByIdAndUpdate(
        id,
        { $set: { ...updateProductDto, status: nextStatus } },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Product with ID "${id}" was not found.`);
    }

    return updated;
  }

  async remove(id: string): Promise<{ deletedId: string; sku: string }> {
    const existing = await this.findOne(id);
    await this.productModel.findByIdAndDelete(id).exec();
    return {
      deletedId: String(existing._id),
      sku: existing.sku,
    };
  }
}
