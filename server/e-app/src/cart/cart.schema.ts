import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Cart {
  @Prop({ required: true, ref: 'User' })
  userId: string;
  @Prop({ required: true, ref: 'Product' })
  productId: string;
  @Prop({ required: true })
  quantity: number;
}
export type CartDocument = Cart & Document;

export const CartSchema = SchemaFactory.createForClass(Cart);
