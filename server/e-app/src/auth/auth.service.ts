import {
  // BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserRole } from 'src/users/utils/role.enum';
// import { AuthResponseDto } from './dto/auth-response.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}
  // private generateAuthResponse(
  //   user: CreateUserDto,
  //   message: string,
  // ): AuthResponseDto {
  //   // sub is the standard JWT claim for "subject"
  //   // We are now assigning the user's email to it
  //   const payload = { sub: user._id, username: user.name };

  //   const token = this.jwtService.sign(payload);
  //   return new AuthResponseDto(
  //     { email: user.email!, name: user.name! },
  //     token,
  //     message,
  //   );
  // }

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const hashedPassword = await bcrypt.compare(password, user.password);

    if (!hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id, username: user.name, role: user.role };
    const token = this.jwtService.sign(payload);
    return { message: `logged in successfully`, token };
  }

  // register a new user and return a JWT token
  async register(createUserDto: CreateUserDto): Promise<any> {
    const user = await this.userService.register({
      name: createUserDto.name || `user-${Math.floor(Math.random() * 1000)}`,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role || UserRole.USER,
    });

    const payload = { sub: user._id, username: user.name, role: user.role };
    const token = this.jwtService.sign(payload);
    return { message: `registered successfully`, token };
  }

  findAll() {
    return `This action returns all auth`;
  }
}
