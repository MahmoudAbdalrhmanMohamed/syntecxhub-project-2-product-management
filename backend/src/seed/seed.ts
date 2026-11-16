import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Product, ProductDocument, ProductStatus } from '../products/schemas/product.schema';

export const SEED_PRODUCTS = [
  {
    name: 'Titan Edge Gateway Pro X1',
    sku: 'SYN-NET-8820',
    price: 1450.0,
    description: 'Industrial multi-WAN edge routing gateway featuring dual 10GbE SFP+ uplinks.',
    category: 'Network Hardware',
    image: 'http://localhost:4000/uploads/product-gateway-x1.svg',
    stockQuantity: 38,
    status: ProductStatus.IN_STOCK,
  },
  {
    name: 'NexusCore 48G Managed L3 Switch',
    sku: 'SYN-SW-4800',
    price: 2190.0,
    description: '48-port PoE++ enterprise rackmount Layer-3 switch with 740W power budget.',
    category: 'Network Hardware',
    image: 'http://localhost:4000/uploads/product-rack-switch-48.svg',
    stockQuantity: 19,
    status: ProductStatus.IN_STOCK,
  },
  {
    name: 'VaultGuard HSM Security Appliance',
    sku: 'SYN-SEC-9100',
    price: 4850.0,
    description: 'FIPS 140-3 Level 3 certified Hardware Security Module for key management.',
    category: 'Security Appliances',
    image: 'http://localhost:4000/uploads/product-zero-trust-hsm.svg',
    stockQuantity: 6,
    status: ProductStatus.LOW_STOCK,
  },
  {
    name: 'DevForge Workstation Z9 Threadripper',
    sku: 'SYN-WS-7400',
    price: 3699.0,
    description: '64-core developer and AI compilation workstation equipped with 128GB ECC DDR5.',
    category: 'Developer Workstations',
    image: 'http://localhost:4000/uploads/product-workstation-z9.svg',
    stockQuantity: 14,
    status: ProductStatus.IN_STOCK,
  },
];

async function runSeed() {
  const logger = new Logger('Project2ProductsSeed');
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const productModel = app.get<Model<ProductDocument>>(getModelToken(Product.name));
    await productModel.deleteMany({});
    const inserted = await productModel.insertMany(SEED_PRODUCTS);
    logger.log(`Seeded ${inserted.length} products into MongoDB.`);
  } finally {
    await app.close();
  }
}

if (require.main === module) {
  runSeed();
}
