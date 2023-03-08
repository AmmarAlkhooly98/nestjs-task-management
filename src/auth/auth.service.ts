import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { genSalt, hash, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private authRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<User> {
    try {
      const { username, password } = authCredentialsDto;
      const salt = await genSalt();
      const hashedPassword = await hash(password, salt);
      const user = this.authRepository.create({
        username,
        password: hashedPassword,
      });
      await this.authRepository.save(user);
      return user;
    } catch (e) {
      if (e.code == 23505)
        throw new ConflictException('this username already exists');
      throw new InternalServerErrorException();
    }
  }

  async signin(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.authRepository.findOne({ where: { username } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const pass = compareSync(password, user?.password);
    if (!pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }
}
