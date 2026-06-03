import {
    IsNotEmpty,
    IsString,
    Matches,
    Length,
    IsNumberString,
} from 'class-validator';

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    bookingId: string;

    // เก็บแค่ตัวเลข ไม่มีช่องว่างหรือขีด
    @IsNumberString()
    @Length(16, 16, { message: 'cardNumber must be exactly 16 digits' })
    cardNumber: string;

    @IsString()
    @IsNotEmpty()
    cardHolder: string;

    @Matches(/^(0[1-9]|1[0-2])$/, { message: 'expiryMonth must be MM format (01-12)' })
    expiryMonth: string;

    @Matches(/^\d{4}$/, { message: 'expiryYear must be YYYY format' })
    expiryYear: string;

    @IsNumberString()
    @Length(3, 4, { message: 'cvv must be 3 or 4 digits' })
    cvv: string;
}
