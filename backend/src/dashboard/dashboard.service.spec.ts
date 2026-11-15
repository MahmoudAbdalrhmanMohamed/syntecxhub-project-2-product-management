import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../products/schemas/product.schema';
import { DashboardService } from './dashboard.service';

describe('DashboardService (Project 2 - Products)', () => {
  let service: DashboardService;

  beforeEach(async () => {
    const mockProducts = [
      {
        _id: '673700000000000000000101',
        name: 'Syntecx Edge Gateway Pro X1',
        sku: 'SYN-NET-8820',
        price: 1000,
        stockQuantity: 5,
        category: 'Network Hardware',
        status: 'low_stock',
        createdAt: new Date(),
      },
    ];
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        {
          provide: getModelToken(Product.name),
          useValue: {
            countDocuments: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(1) }),
            find: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProducts) }),
              sort: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProducts) }),
              }),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('aggregates product inventory valuation and category distribution', async () => {
    const stats = await service.getStats();
    expect(stats.summary.totalProducts).toBe(1);
    expect(stats.summary.totalInventoryValue).toBe(5000);
  });
});
