import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateBookingDto {
    @IsNotEmpty()
    @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
