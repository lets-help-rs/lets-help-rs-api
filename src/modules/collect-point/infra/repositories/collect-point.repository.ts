import { Injectable } from '@nestjs/common';
import { CollectPoint } from '@prisma/client';
import { PrismaService } from 'src/database/prisma/prisma.service';

import { FindAllResponseDto } from 'src/shared/domain/dtos/find-all-response.dto';

import { CreateCollectPointDto } from '../../domain/dtos/create-collect-point.dto';
import { ListCollectPointParams } from '../../domain/dtos/list-collect-point.dto';
import { ReviewCollectPointDto } from '../../domain/dtos/review-collect-point.dto';
import CollectPointEntity from '../../domain/entities/collect-point.entity';
import { ReviewTypeEnum } from '../../domain/enums/review-type.enum';

@Injectable()
export class CollectPointRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async review(
    id: string,
    reviewCollectPointDto: ReviewCollectPointDto,
  ): Promise<CollectPointEntity> {
    const { type } = reviewCollectPointDto;

    let collectPoint = await this.prismaService.collectPoint.update({
      where: {
        id,
      },
      data: {
        goodReviews: {
          increment: type === ReviewTypeEnum.APPROVE ? 1 : 0,
        },
        badReviews: {
          increment: type === ReviewTypeEnum.REPORT ? 1 : 0,
        },
        updatedAt: new Date(),
      },
    });

    if (collectPoint.badReviews >= Number(process.env.REPORT_DELETE)) {
      collectPoint = await this.prismaService.collectPoint.delete({
        where: {
          id,
        },
      });
    }

    return CollectPointEntity.fromPrisma(collectPoint);
  }

  async create(
    createCollectPointDto: CreateCollectPointDto,
  ): Promise<CollectPointEntity> {
    const collectPoint = await this.prismaService.collectPoint.create({
      data: {
        ...createCollectPointDto,
      },
    });

    return CollectPointEntity.fromPrisma(collectPoint);
  }

  async findAll(
    params: ListCollectPointParams,
  ): Promise<FindAllResponseDto<Array<CollectPointEntity>>> {
    const { where } = params;

    const [total, prismaCollectPoints] = await this.prismaService.$transaction([
      this.prismaService.collectPoint.count({
        where,
      }),
      this.prismaService.collectPoint.findMany({
        where,
      }),
    ]);

    const collectPoints = prismaCollectPoints.map((collectPoint) =>
      CollectPointEntity.fromPrisma(collectPoint),
    );

    return {
      data: collectPoints,
      total: total,
    };
  }

  async findOne(id: string): Promise<CollectPointEntity> {
    const collectPoint = await this.prismaService.collectPoint.findUnique({
      where: {
        id,
      },
    });

    return CollectPointEntity.fromPrisma(collectPoint);
  }

  async findBy(where: Partial<CollectPoint>): Promise<CollectPointEntity[]> {
    const collectPoints = await this.prismaService.collectPoint.findMany({
      where,
    });

    return collectPoints.map((collectPoint) =>
      CollectPointEntity.fromPrisma(collectPoint),
    );
  }

  async findOneBy(where: Partial<CollectPoint>): Promise<CollectPointEntity> {
    const collectPoint = await this.prismaService.collectPoint.findFirst({
      where,
    });

    return CollectPointEntity.fromPrisma(collectPoint);
  }

  async remove(id: string): Promise<CollectPointEntity> {
    const collectPoint = await this.prismaService.collectPoint.delete({
      where: {
        id,
      },
    });

    return CollectPointEntity.fromPrisma(collectPoint);
  }

  async removeBy(where: Partial<CollectPoint>): Promise<CollectPointEntity> {
    const collectPoint = await this.prismaService.collectPoint.deleteMany({
      where,
    });

    return CollectPointEntity.fromPrisma(collectPoint[0]);
  }
}
