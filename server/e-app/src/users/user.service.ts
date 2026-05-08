import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import {
  BadRequestException,
  NotFoundException,
  // InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async register(createUserDto: CreateUserDto) {
    try {
      if (!createUserDto.password) {
        throw new BadRequestException('Password is required');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });

      await createdUser.save();
      return createdUser;
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new BadRequestException(`Failed to create user: ${error.message}`);
    }
  }

  async findAll() {
    const users = await this.userModel.find().exec();
    return users;
  }

  async findByName(name: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        name: name,
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with name ${name} not found`);
    }
    return user;
  }
  async findEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel
      .findOne({
        email: email,
      })
      .exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateUserDto },
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async remove(id: string) {
    const removedUser = await this.userModel.find({
      _id: id,
    });
    if (!removedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return `User with ID ${id} has been removed successfully`;
  }
}
