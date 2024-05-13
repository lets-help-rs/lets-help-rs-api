import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReviewTypeEnum } from '../enums/review-type.enum';

export class ReviewCollectPointDto {
  @ApiProperty({
    description: 'Tipo da revisão do ponto de coleta',
    example: ReviewTypeEnum.APPROVE,
  })
  @IsEnum({ message: 'Tipo da revisão em formato inválido' })
  @IsNotEmpty()
  type: ReviewTypeEnum;
}
