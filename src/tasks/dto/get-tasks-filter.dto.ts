import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  @ApiProperty({ required: false })
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: false,
    description: 'Filter tasks by searching through titles and descriptions.',
  })
  search?: string;
}
