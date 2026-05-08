import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, lowercase: true })
  slug!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ default: 0, min: 0 })
  stock!: number;

  @Prop()
  description?: string;

  @Prop([String]) // Array of image URLs
  images?: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category?: Types.ObjectId;

  @Prop({ default: false })
  isPublished!: boolean;
}
export type ProductDocument = Product & Document;

export const ProductSchema = SchemaFactory.createForClass(Product);
