import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export enum ProductStatus {
  IN_STOCK = 'in_stock',
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  ARCHIVED = 'archived',
}

export const PRODUCT_CATEGORIES = [
  'Cloud Infrastructure',
  'Network Hardware',
  'Security Appliances',
  'Developer Workstations',
  'Edge IoT Sensors',
  'Enterprise Software',
] as const;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      ret.id = String(ret._id);
      return ret;
    },
  },
})
export class Product {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 140, index: true })
  name: string;

  @Prop({ required: true, min: 0, index: true })
  price: number;

  @Prop({ required: true, trim: true, minlength: 10, maxlength: 2000 })
  description: string;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ default: '', trim: true })
  image: string;

  @Prop({
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  })
  sku: string;

  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;

  @Prop({
    type: String,
    enum: Object.values(ProductStatus),
    default: ProductStatus.IN_STOCK,
    index: true,
  })
  status: ProductStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ name: 'text', sku: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: 1, status: 1 });
