import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty({ message: 'الاسم مطلوب' })
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty({ message: 'اسم المستخدم مطلوب' })
    @IsString()
    @MinLength(3, { message: 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل' })
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'اسم المستخدم يجب أن يحتوي على أحرف وأرقام و _ فقط' })
    username: string;

    @IsEmail({}, { message: 'بريد إلكتروني غير صالح' })
    email: string;

    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    @MinLength(6, { message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' })
    password: string;
}

export class LoginDto {
    @IsEmail({}, { message: 'بريد إلكتروني غير صالح' })
    email: string;

    @IsNotEmpty({ message: 'كلمة المرور مطلوبة' })
    password: string;
}
