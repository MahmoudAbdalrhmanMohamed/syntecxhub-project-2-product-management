import { BadRequestException, ConflictException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Product, ProductStatus } from './schemas/product.schema';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProduct = {
    _id: '673700000000000000000101',
    name: 'Titan Edge Gateway Pro X1',
    sku: 'SYN-NET-8820',
    price: 1450,
    description: 'High-throughput industrial edge gateway',
    category: 'Network Hardware',
    stockQuantity: 38,
    status: ProductStatus.IN_STOCK,
  };

  const mockProductModel: any = jest.fn().mockImplementation((dto) => ({
    ...dto,
    _id: '673700000000000000000102',
    save: jest.fn().mockResolvedValue({
      _id: '673700000000000000000102',
      ...dto,
    }),
  }));

  mockProductModel.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([mockProduct]),
        }),
      }),
    }),
  });
  mockProductModel.countDocuments = jest.fn().mockReturnValue({
    exec: jest.fn().mockResolvedValue(1),
  });
  mockProductModel.findOne = jest.fn();
  mockProductModel.findById = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  it('rejects invalid price range where minPrice > maxPrice', async () => {
    await expect(
      service.findAll({
        page: 1,
        limit: 10,
        minPrice: 2000,
        maxPrice: 500,
        sortBy: 'price',
        sortOrder: 'asc',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('prevents duplicate SKU creation with ConflictException', async () => {
    mockProductModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockProduct),
    });

    await expect(
      service.create({
        name: 'Another Gateway',
        sku: 'syn-net-8820',
        price: 999,
        description: 'Duplicate SKU test product item',
        category: 'Network Hardware',
        stockQuantity: 15,
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('automatically derives LOW_STOCK status when stockQuantity <= 10', async () => {
    mockProductModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const created = await service.create({
      name: 'VaultGuard HSM Appliance',
      sku: 'SYN-SEC-9999',
      price: 4850,
      description: 'Hardware security module with low stock units',
      category: 'Security Appliances',
      stockQuantity: 5,
    });

    expect(created.status).toBe(ProductStatus.LOW_STOCK);
  });
});
