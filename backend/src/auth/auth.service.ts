import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService,
    ) { }

    private generateToken(id: string): string {
        return this.jwtService.sign({ id });
    }

    async register(registerDto: RegisterDto) {
        const { name, username, email, password } = registerDto;

        // Check existing email
        const existingEmail = await this.userModel.findOne({ email: email.toLowerCase() });
        if (existingEmail) {
            throw new BadRequestException('البريد الإلكتروني مسجل مسبقاً');
        }

        // Check existing username
        const existingUsername = await this.userModel.findOne({ username: username.toLowerCase() });
        if (existingUsername) {
            throw new BadRequestException('اسم المستخدم مسجل مسبقاً');
        }

        const user = await this.userModel.create({
            name,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password,
        });

        const token = this.generateToken(user._id.toString());

        return {
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
            },
        };
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.userModel.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            throw new UnauthorizedException('بريد إلكتروني أو كلمة مرور غير صحيحة');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new UnauthorizedException('بريد إلكتروني أو كلمة مرور غير صحيحة');
        }

        const token = this.generateToken(user._id.toString());

        return {
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                points: user.points,
                level: user.level,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId).select('-password');
        return {
            success: true,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                points: user.points,
                weeklyPoints: user.weeklyPoints,
                level: user.level,
                streak: user.streak,
                progress: user.progress,
                createdAt: (user as any).createdAt,
            },
        };
    }
}
