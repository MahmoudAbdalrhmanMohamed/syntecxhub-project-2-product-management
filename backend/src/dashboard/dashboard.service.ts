import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from '../products/schemas/product.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
  ) {}

  async getStats() {
    const [totalProducts, lowStockProducts, outOfStockProducts, allProducts, recentProducts] =
      await Promise.all([
        this.productModel.countDocuments().exec(),
        this.productModel.countDocuments({ status: ProductStatus.LOW_STOCK }).exec(),
        this.productModel.countDocuments({ status: ProductStatus.OUT_OF_STOCK }).exec(),
        this.productModel.find().select('price stockQuantity category status').exec(),
        this.productModel.find().sort({ createdAt: -1 }).limit(6).exec(),
      ]);

    const totalInventoryValue = allProducts.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.stockQuantity || 0),
      0,
    );

    const categoryMap = new Map<string, { count: number; value: number }>();
    for (const prod of allProducts) {
      const current = categoryMap.get(prod.category) || { count: 0, value: 0 };
      current.count += 1;
      current.value += Number(prod.price || 0) * Number(prod.stockQuantity || 0);
      categoryMap.set(prod.category, current);
    }

    return {
      summary: {
        totalProducts,
        lowStockProducts,
        outOfStockProducts,
        totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
      },
      distributions: {
        productsByCategory: Array.from(categoryMap.entries()).map(([category, stats]) => ({
          category,
          count: stats.count,
          inventoryValue: Math.round(stats.value * 100) / 100,
        })),
      },
      recent: {
        products: recentProducts,
      },
    };
  }

  async getActivity() {
    const recentProducts = await this.productModel.find().sort({ updatedAt: -1 }).limit(8).exec();
    const events = recentProducts.map((p) => ({
      id: `product-${String(p._id)}`,
      type: 'product_updated' as const,
      title: `Inventory SKU synced: ${p.name}`,
      subtitle: `SKU ${p.sku} • $${Number(p.price).toFixed(2)} • ${p.stockQuantity} units (${p.category})`,
      timestamp: (p.updatedAt || p.createdAt || new Date()).toISOString(),
      actor: 'Inventory Control',
    }));
    return { events, totalEvents: events.length };
  }
}
