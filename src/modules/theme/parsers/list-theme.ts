import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, Min } from "class-validator";

export class ListThemePayload {
  @ApiProperty()
  @IsNotEmpty()
  seller: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  theme_id: number;

  @ApiProperty()
  @IsNumber()
  listing_price: number;

  @ApiProperty()
  @IsNumber()
  sale_price: number;
}
