import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class BuyThemePayload {
  @ApiProperty()
  @IsNotEmpty()
  buyer: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  theme_id: number;
}
